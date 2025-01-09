const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for product attributes
const attributeSchema = new Schema(
  {
    name: { type: String, required: true }, // Attribute name, e.g., 'Color', 'Size'
    value: { type: [String], required: true }, // Possible values, e.g., ['Red', 'Blue']
  },
  { _id: false }, // Disable _id for embedded documents
);

// Product schema
const productSchema = new Schema(
  {
    name: { type: String, required: true }, // Product name
    description: { type: String, required: true }, // Product description
    price: { type: Number, required: true }, // Current price
    rating: { type: Number, default: 0 }, // Average rating, default 0
    reviews: { type: Number, default: 0 }, // Number of reviews, default 0
    discount: { type: Number, default: 0 }, // Discount percentage, default 0
    attributes: { type: [attributeSchema], required: true }, // Attributes schema
    quantity: { type: Number, default: 0 }, // Available quantity
    images: [
      {
        type: String, // Product images
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true, // Reference to the category
    },
    variants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant", // Reference to the Variant model
      },
    ],
  },
  { timestamps: true }, // Add createdAt and updatedAt timestamps
);

// Middleware to remove deleted product from users' carts
productSchema.pre("findOneAndDelete", async function (next) {
  try {
    const productId = this.getQuery()._id; // Get the ID of the product being deleted

    if (productId) {
      // Remove this product from all users' carts
      await mongoose
        .model("User")
        .updateMany(
          { "cart.product": productId },
          { $pull: { cart: { product: productId } } },
        );
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", productSchema);
