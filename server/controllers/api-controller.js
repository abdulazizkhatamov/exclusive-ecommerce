const Category = require("../models/category-schema");
const Product = require("../models/product-schema");
const { getBestSellingProducts } = require("../utils/query-funcs");

exports.getCategories = async (req, res) => {
  try {
    // Fetch all categories and populate the parent field
    const categories = await Category.find().populate("parent", "name").exec();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getParentCategories = async (req, res) => {
  try {
    const dbCategories = await Category.find({ parent: null });

    return res.status(200).json(dbCategories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("variants")
      .exec();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getBestSellingProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Optional limit parameter
    const bestSellers = await getBestSellingProducts(limit);

    console.log(bestSellers);
    res.status(200).json({ success: true, data: bestSellers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { _id } = req.params;

  try {
    if (!_id) {
      return res.status(400).send({ message: "Bad request" });
    }

    const product = await Product.findById(_id)
      .populate("category")
      .populate("variants")
      .exec();

    if (!product) {
      return res.status(404).send({ message: "Product not found." });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
