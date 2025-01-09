const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Variant schema
const variantSchema = new Schema(
  {
    sku: { type: String, required: true }, // Stock Keeping Unit
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true, // Reference to the product
    },
    attributes: [
      {
        name: { type: String, required: true }, // Attribute name, e.g., 'Color'
        value: { type: String, required: true }, // Selected value, e.g., 'Red'
      },
    ],
    price: { type: Number, required: true }, // Price of the variant
    stock: { type: Number, required: true }, // Stock quantity
    images: { type: [String], default: [] }, // Array of image URLs for this variant
  },
  { timestamps: true },
);

// Middleware to remove deleted variant from users' carts
variantSchema.pre("findOneAndDelete", async function (next) {
  try {
    const variantId = this.getQuery()._id; // Get the ID of the variant being deleted

    if (variantId) {
      // Remove this variant from all users' carts
      await mongoose
        .model("User")
        .updateMany(
          { "cart.variant": variantId },
          { $pull: { cart: { variant: variantId } } },
        );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
