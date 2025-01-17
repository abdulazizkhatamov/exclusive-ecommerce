const Email = require("../models/email-schema");
const Category = require("../models/category-schema");
const Product = require("../models/product-schema");
const { getBestSellingProducts } = require("../utils/query-funcs");

exports.postSubmitMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create a new email entry with the provided information
    const newEmail = new Email({
      participant: {
        name,
        email,
        phone,
      },
      messages: [
        {
          sender: "user", // Message sent by the user
          message,
          sentAt: Date.now(),
          isRead: false,
        },
      ],
    });

    // Save the email thread in the database
    await newEmail.save();

    // Respond with a success message
    res
      .status(201)
      .json({ message: "Message submitted successfully", email: newEmail });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error submitting message", error: error.message });
  }
};

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

exports.getCategoryProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const dbCategory = await Category.findById(id);

    if (!dbCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let categoriesToSearch = [id]; // Start with the given category id

    // If the category is a parent category (it has subcategories), gather products from all its subcategories
    if (!dbCategory.parent) {
      // Find all subcategories of this parent category
      const dbSubcategories = await Category.find({ parent: id }).select("_id");

      // Add subcategory IDs to the search list
      categoriesToSearch = categoriesToSearch.concat(
        dbSubcategories.map((subcategory) => subcategory._id),
      );
    }

    // Find products belonging to the parent category and its subcategories
    const products = await Product.find({
      category: { $in: categoriesToSearch },
    })
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
  let limit = parseInt(req.query.limit);

  // Only set a valid positive limit, otherwise, fetch all
  if (isNaN(limit) || limit <= 0) {
    limit = undefined;
  }

  try {
    const bestSellers = await getBestSellingProducts(limit);

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

exports.getRelatedProducts = async (req, res) => {
  const { _id } = req.params;

  try {
    const dbProduct = await Product.findById(_id);

    if (!dbProduct) {
      return res.status(404).send({ message: "Product not found." });
    }

    const dbProducts = await Product.find({ category: dbProduct.category });

    const relatedProducts = dbProducts.filter(
      (product) => product._id.toString() !== dbProduct._id.toString(),
    );

    // Check if relatedProducts is empty
    if (relatedProducts.length === 0) {
      return res.status(404).send({ message: "Related products not found." });
    }

    return res.status(200).json(relatedProducts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
