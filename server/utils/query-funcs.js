const Order = require("../models/order-schema");
const Product = require("../models/product-schema");

module.exports = {
  getBestSellingProducts: async (limit) => {
    try {
      const pipeline = [
        { $unwind: "$products" }, // Flatten the products array
        {
          $group: {
            _id: "$products.product", // Group by product ID
            totalSold: { $sum: "$products.quantity" }, // Sum quantities sold
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by total sold in descending order
      ];

      if (limit) {
        pipeline.push({ $limit: limit }); // Add $limit conditionally
      }

      const bestSellers = await Order.aggregate(pipeline);

      if (bestSellers.length > 0) {
        const populatedProducts = await Product.populate(bestSellers, {
          path: "_id",
        });

        // Ensure unique products, filter out nulls, and ensure populated products are valid
        const uniqueProducts = Array.from(
          new Map(
            populatedProducts
              .filter((item) => item._id != null) // Ensure we are not dealing with null/undefined values
              .map((item) => [item._id.toString(), item._id]),
          ).values(),
        );

        return uniqueProducts;
      }
      return []; // No best sellers found
    } catch (err) {
      console.error("Error fetching best-selling products:", err);
      throw err;
    }
  },
};
