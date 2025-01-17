const User = require("../models/user-schema");
const Category = require("../models/category-schema");
const Product = require("../models/product-schema");
const Variant = require("../models/variant-schema");
const Order = require("../models/order-schema");

exports.getUserQtyDashboard = async (req, res) => {
  const currentDate = new Date();

  // Get the total number of users
  const totalUsers = await User.countDocuments();

  // Get the number of users registered in the current month
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const currentMonthUsers = await User.countDocuments({
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Get the number of users registered in the previous month
  const startOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  const endOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  );
  const lastMonthUsers = await User.countDocuments({
    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  // Calculate percentage change from last month
  const percentageChange = lastMonthUsers
    ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
    : 0;

  return res.json({
    totalUsers,
    currentMonthUsers,
    percentageChange,
  });
};

exports.getSalesQtyDashboard = async (req, res) => {
  // Get current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get total sales for the current month
  const currentMonthSales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, currentMonth, 1), // First day of current month
          $lt: new Date(currentYear, currentMonth + 1, 0), // Last day of current month
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  const currentSales = currentMonthSales[0]
    ? currentMonthSales[0].totalSales
    : 0;

  // Get total sales for the previous month
  const lastMonthSales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(currentYear, currentMonth - 1, 1), // First day of last month
          $lt: new Date(currentYear, currentMonth, 0), // Last day of last month
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  const lastSales = lastMonthSales[0] ? lastMonthSales[0].totalSales : 0;

  // Calculate the percentage change
  const percentageChange =
    lastSales > 0 ? ((currentSales - lastSales) / lastSales) * 100 : 0;

  res.json({
    totalSales: currentSales,
    percentageChange: parseFloat(percentageChange.toFixed(2)), // Convert back to number
  });
};

exports.getRecentSalesDashboard = async (req, res) => {
  // Get the most recent 5 orders
  const recentSales = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: "Placed" }, // Exclude orders with "Placed" status
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort by the most recent orders first
    },
    {
      $limit: 5, // Limit to the top 5 recent orders
    },
    {
      $lookup: {
        from: "users", // Lookup user details
        localField: "user", // The field to match from the Order
        foreignField: "_id", // The field to match from the User collection
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", // Unwind the userDetails array (it should have 1 item per user)
    },
    {
      $project: {
        _id: 0,
        userId: "$user", // User ID
        totalAmount: 1, // The total amount of the order
        fullName: "$userDetails.fullName", // Assuming `fullName` is a field in the User model
        email: "$userDetails.email", // Assuming `email` is a field in the User model
      },
    },
  ]);

  res.json(recentSales); // Return the recent sales data
};

exports.getCategoryDistributions = async (req, res) => {
  const data = await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products",
      },
    },
    { $project: { name: 1, productCount: { $size: "$products" } } },
  ]);

  return res.json(data);
};

exports.getCategoryPerformances = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$products" },
    {
      $match: {
        orderStatus: { $ne: "Placed" }, // Exclude orders with "Placed" status
      },
    },
    {
      $addFields: {
        "products.product.category": {
          $toObjectId: "$products.product.category", // Cast to ObjectId if it's a string
        },
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "products.product.category", // Match the category ID (now an ObjectId)
        foreignField: "_id", // Match with the _id field in categories
        as: "category",
      },
    },
    { $unwind: { path: "$category" } },
    {
      $group: {
        _id: "$category.name", // Group by category name
        totalRevenue: { $sum: "$products.price" },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 15 },
  ]);

  return res.json(data);
};

exports.getCategoryStatuses = async (req, res) => {
  const data = await Category.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return res.json(data);
};

exports.getProductInventory = async (req, res) => {
  const data = await Product.aggregate([
    { $project: { name: 1, stock: "$quantity" } },
    { $sort: { stock: 1 } }, // Low stock first
  ]);

  return res.json(data);
};

exports.getTopSellingProducts = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$products" }, // Flatten the products array
    {
      $group: {
        _id: "$products.product", // Group by product ID
        totalSold: { $sum: "$products.quantity" }, // Sum quantities sold
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }, // Limit to top 'n' results
  ]);

  // Transform the data
  const transformedData = data.reduce((acc, { _id, totalSold }) => {
    const productName = _id.name;
    const existingProduct = acc.find((item) => item.name === productName);

    if (existingProduct) {
      existingProduct.totalSold += totalSold;
    } else {
      acc.push({ name: productName, totalSold });
    }

    return acc;
  }, []);

  return res.json(transformedData);
};

exports.getProductRatings = async (req, res) => {
  const data = await Product.aggregate([
    { $project: { name: 1, averageRating: "$rating", reviews: "$reviews" } },
    { $sort: { averageRating: -1 } },
  ]);

  return res.json(data);
};

exports.getDiscountImpacts = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: { discounted: { $gt: ["$product.discount", 0] } },
        totalRevenue: { $sum: "$products.price" },
      },
    },
  ]);

  return res.json(data);
};

exports.getSalesByVariants = async (req, res) => {
  const data = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.variant",
        totalRevenue: {
          $sum: { $multiply: ["$products.quantity", "$products.price"] },
        },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "_id",
        as: "variant",
      },
    },
    { $unwind: "$variant" },
    {
      $project: {
        variantName: "$variant.sku",
        totalRevenue: 1,
        totalQuantity: 1,
      },
    },
    { $sort: { totalRevenue: -1 } },
  ]);

  return res.json(data);
};

exports.getVariantStock = async (req, res) => {
  const data = await Variant.aggregate([
    { $project: { sku: 1, stock: 1 } },
    { $sort: { stock: 1 } },
  ]);

  return res.json(data);
};

exports.getOrderStatusDistribution = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  return res.json(data);
};

exports.getRevenueTrends = async (req, res) => {
  const data = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: "Placed" }, // Exclude orders with "Placed" status
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } }, // Sort by date
  ]);

  return res.json(data);
};

exports.getPaymentMethodUsage = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$paymentMethod",
        totalRevenue: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
  ]);

  return res.json(data);
};

exports.getPeakOrderTimes = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $hour: "$createdAt" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by hour
  ]);

  return res.json(data);
};

exports.getSalesFunnel = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return res.json(data);
};

exports.getSeasonalTrends = async (req, res) => {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } }, // Sort by month
  ]);

  return res.json(data);
};
