const Order = require("../models/order-schema");
const Product = require("../models/product-schema");

module.exports = {
  getBestSellingProducts: async (limit = 10) => {
    try {
      const bestSellers = await Order.aggregate([
        { $unwind: "$products" }, // Flatten the products array
        {
          $group: {
            _id: "$products.product", // Group by product ID
            totalSold: { $sum: "$products.quantity" }, // Sum quantities sold
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by total sold in descending order
        { $limit: limit }, // Limit to top 'n' results
      ]);

      // Check if the bestSellers array has populated values
      if (bestSellers && bestSellers.length > 0) {
        // Populate the product details directly in the aggregation pipeline
        const populatedProducts = await Product.populate(bestSellers, {
          path: "_id", // Populate the referenced product data
        });

        // Filter out any null products and return the populated product data
        return populatedProducts
          .filter((item) => item._id !== null)
          .map((item) => item._id);
      } else {
        return []; // No best sellers found
      }
    } catch (err) {
      console.error("Error fetching best-selling products:", err);
      throw err;
    }
  },
};
