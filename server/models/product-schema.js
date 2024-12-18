const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String, // URLs or paths to images
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: false, // Product can either have a category or subcategory
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: false, // Product can either have a category or subcategory
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the `updatedAt` field
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
