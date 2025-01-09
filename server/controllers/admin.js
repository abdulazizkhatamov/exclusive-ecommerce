const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Category = require("../models/category-schema");
const Product = require("../models/product-schema");
const Variant = require("../models/variant-schema");
const { parse } = require("dotenv");

exports.getAdmin = async (req, res) => {
  return res.json(req.admin);
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().exec();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getCategories = async (req, res) => {
  try {
    // Find top-level categories (categories with no parent)
    const categories = await Category.aggregate([
      {
        $match: { parent: null }, // Fetch only top-level categories
      },
      {
        $lookup: {
          from: "categories", // Self-reference to find subcategories
          localField: "_id",
          foreignField: "parent",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "products", // Join with products to count associated ones
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          subcategories: { $size: "$subcategories" }, // Count of subcategories
          products: { $size: "$products" }, // Count of products
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getSubcategories = async (req, res) => {
  try {
    // Find subcategories (categories that have a parent)
    const subcategories = await Category.aggregate([
      {
        $match: { parent: { $ne: null } }, // Fetch only subcategories (categories with a parent)
      },
      {
        $lookup: {
          from: "categories", // Join with categories to get the parent category
          localField: "parent",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: "$parentCategory", // Unwind the array to get the parent category object
      },
      {
        $lookup: {
          from: "products", // Join with products to count associated ones
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          status: 1,
          parent: 1,
          createdAt: 1,
          updatedAt: 1,
          category: "$parentCategory.name", // Add parent category's name as `category`
          products: { $size: "$products" }, // Count of products
        },
      },
    ]);

    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getSubcategoriesByParent = async (req, res) => {
  const { _id } = req.params;
  const categoryId = new mongoose.Types.ObjectId(_id);

  try {
    const subcategories = await Category.aggregate([
      {
        $match: { parent: categoryId }, // Ensure _id is cast correctly
      },
      {
        $lookup: {
          from: "categories", // Lookup parent category
          localField: "parent",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: {
          path: "$parentCategory",
          preserveNullAndEmptyArrays: true, // Handle cases where parentCategory is missing
        },
      },
      {
        $lookup: {
          from: "products", // Lookup associated products
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          category: "$parentCategory.name", // Add parent category's name
          parent: "$parentCategory._id",
          products: { $size: "$products" }, // Count the number of products
        },
      },
    ]);

    console.log("Subcategories:", subcategories); // Debug the result
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.postCreateCategory = async (req, res) => {
  const { name, description, status, parent } = req.body;

  // Step 1: Validate the request data
  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required" });
  }

  try {
    // Step 2: Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    // Step 3: If a parent is provided, ensure it exists
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ message: "Parent category not found" });
      }
    }

    // Step 4: Create the category
    const newCategory = await Category.create({
      name,
      description,
      status,
      parent: parent || null, // Null for top-level categories
    });

    // Step 5: Return a success response
    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while creating the category" });
  }
};

exports.putUpdateCategory = async (req, res) => {
  const { _id, name, description, status, parent } = req.body;

  console.log(req.body);

  // Step 1: Validate input
  if (!_id || !name || !description) {
    return res
      .status(400)
      .json({ message: "ID, name, and description are required" });
  }

  try {
    // Step 2: Check if the category exists
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 3: Check if a category with the new name already exists (excluding the current one)
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }

    // Step 4: Validate the parent category (if provided)
    if (parent) {
      if (!category._id.equals(parent)) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(400).json({ message: "Parent category not found" });
        }

        // Prevent circular references
        const isCircular = await Category.findOne({ _id: parent, parent: _id });
        if (isCircular) {
          return res
            .status(400)
            .json({ message: "Circular reference detected" });
        }
      }
    }

    // Step 5: Update the category details
    category.name = name;
    category.description = description;
    category.status = typeof status !== "undefined" ? status : category.status;
    category.parent = parent || null; // Allow moving a category to the top level by setting parent to null

    // Step 6: Save the updated category
    const updatedCategory = await category.save();

    // Step 7: Return success response
    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the category" });
  }
};

exports.deleteDeleteCategory = async (req, res) => {
  const { _id } = req.params;

  // Step 1: Validate input
  if (!_id) {
    return res.status(400).json({ message: "Category ID is required" });
  }

  try {
    // Step 2: Check if the category exists
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Step 3: Check for subcategories
    const subcategories = await Category.find({ parent: _id });
    if (subcategories.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with existing subcategories. Please delete or reassign them first.",
      });
    }

    // Step 4: Check for products
    const products = await Product.find({ category: _id });
    if (products.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with associated products. Please delete or reassign them first.",
      });
    }

    // Step 5: Delete the category
    await Category.findByIdAndDelete(_id);

    // Step 6: Return a success response
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the category" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("variants")
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.getProduct = async (req, res) => {
  const { _id } = req.params;

  console.log(_id);

  try {
    const product = await Product.findById(_id)
      .populate("variants")
      .populate("category")
      .exec();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.postCreateProduct = async (req, res) => {
  try {
    const { name, description, category, price, attributes } = req.body;

    // Validate basePrice as a number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Invalid base price provided" });
    }

    // Parse attributes (validate JSON format)
    let parsedAttributes;
    try {
      parsedAttributes = attributes.map((attr) =>
        typeof attr === "string" ? JSON.parse(attr) : attr,
      );
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Attributes must be valid JSON objects" });
    }

    // Extract file paths from uploaded files
    const images = req.files.map((file) => file.path);

    // Create the product object
    const product = new Product({
      name,
      description,
      price: parsedPrice,
      category,
      images,
      attributes: parsedAttributes,
    });

    // Save the product to the database
    await product.save();

    // Respond with success
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.putUpdateProduct = async (req, res) => {
  try {
    const { name, description, price, category, oldImages, attributes } =
      req.body;
    const newImages = req.files ? req.files.map((file) => file.path) : [];

    // Parse attributes (validate JSON format)
    let parsedAttributes;
    try {
      parsedAttributes = attributes.map((attr) =>
        typeof attr === "string" ? JSON.parse(attr) : attr,
      );
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Attributes must be valid JSON objects" });
    }

    // Find the existing product by its ID
    const productId = req.params._id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.attributes = parsedAttributes;

    // If new images are uploaded, merge them with old ones
    if (newImages.length) {
      product.images = [...oldImages, ...newImages]; // Merge old and new images
    }

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product",
      error,
    });
  }
};

exports.deleteDeleteProduct = async (req, res) => {
  const { _id } = req.params;

  // Step 1: Validate input
  if (!_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Step 2: Check if the product exists
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 3: Delete all variants associated with the product and remove their images
    await Variant.deleteMany({ product: _id });

    // Step 5: Delete the product
    await Product.findByIdAndDelete(_id);

    // Step 6: Return a success response
    return res.status(200).json({
      message: "Product, its variants, and images deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product, variants, and images:", error);
    return res.status(500).json({
      message:
        "An error occurred while deleting the product, its variants, and images",
    });
  }
};

exports.getProductVariants = async (req, res) => {
  const { product } = req.params;

  try {
    if (!product) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const variants = await Variant.find({ product })
      .populate("product", "_id name")
      .exec();

    return res.status(200).json(variants);
  } catch (error) {
    console.error("Error fetching product variants:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.postCreateVariant = async (req, res) => {
  try {
    // Extract the body payload
    const { sku, product, price, stock, attributes } = req.body;

    // Parse attributes from stringified JSON in the array
    const parsedAttributes = JSON.parse(attributes);

    // Handle uploaded images (if any)
    const imagePaths = req.files ? req.files.map((file) => file.path) : [];

    // Create the variant object
    const variantData = {
      sku,
      product,
      price: parseFloat(price), // Ensure price is a number
      stock: parseInt(stock, 10), // Ensure stock is an integer
      attributes: parsedAttributes,
      images: imagePaths, // Store paths of uploaded images
    };

    // Save the variant to the database
    const newVariant = new Variant(variantData);
    await newVariant.save();

    // Check if the product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product with the new variant
    await Product.findByIdAndUpdate(
      product, // Product ID
      {
        $push: { variants: newVariant._id }, // Push the variant's _id into the variants array
        $inc: { quantity: parseInt(stock) }, // Increment the quantity field by the value of stock
      },
      { new: true }, // Return the updated document
    );

    // Respond with success
    res.status(201).json({
      message: "Variant created successfully",
      variant: newVariant,
    });
  } catch (error) {
    console.error("Error creating variant:", error);

    // Respond with error
    res.status(500).json({
      message: "Error creating variant",
      error: error.message,
    });
  }
};

exports.putUpdateVariant = async (req, res) => {
  try {
    const {
      id,
      oldImages = [],
      sku,
      product,
      attributes,
      price,
      stock,
    } = req.body;
    const newImages = req.files; // Assuming req.files is an array of uploaded files

    // Find the variant to update
    const variant = await Variant.findById(id);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Calculate the stock difference (new stock - old stock)
    const stockDifference = stock - variant.stock;

    // Compare old images with the new images and delete those that are no longer needed
    if (!oldImages.length) {
      variant.images = []; // Reset the images array
    } else {
      // Update the variant images array with the new images
      variant.images = oldImages;
    }

    // Add new images from req.files
    if (newImages && newImages.length > 0) {
      const newImagePaths = newImages.map((file) => file.path); // Extract paths from uploaded files
      variant.images = [...variant.images, ...newImagePaths]; // Push the new images into the images array
    }

    // Update other fields of the variant
    variant.sku = sku;
    variant.product = product;
    variant.attributes = JSON.parse(attributes); // Assuming attributes is a string and needs to be parsed
    variant.price = price;
    variant.stock = stock;

    // Save the updated variant
    await variant.save();

    // Update the product's quantity based on the stock difference
    const productToUpdate = await Product.findById(product);
    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    productToUpdate.quantity += stockDifference;

    // Save the updated product
    await productToUpdate.save();

    return res
      .status(200)
      .json({ message: "Variant updated successfully", variant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteDeleteVariant = async (req, res) => {
  const { _id } = req.params;

  // Step 1: Validate input
  if (!_id) {
    return res.status(400).json({ message: "Variant ID is required" });
  }

  try {
    // Step 2: Check if the variant exists
    const variant = await Variant.findById(_id);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Step 3: Find the associated product and decrement the quantity
    const product = await Product.findById(variant.product);
    if (product) {
      await Product.findByIdAndUpdate(product._id, {
        $inc: { quantity: -variant.stock }, // Decrement quantity by variant's stock
        $pull: { variants: variant._id },
      });
    }

    // Step 5: Delete the variant
    await Variant.findByIdAndDelete(_id);

    // Step 6: Return a success response
    return res.status(200).json({
      message: "Variant, images, and product quantity updated successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting variant and updating product quantity:",
      error,
    );
    return res.status(500).json({
      message:
        "An error occurred while deleting the variant and updating product quantity",
    });
  }
};
