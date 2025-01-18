const mongoose = require("mongoose");
const postmark = require("postmark");
const io = require("../utils/socket");

const Admin = require("../models/admin-schema");
const Category = require("../models/category-schema");
const Product = require("../models/product-schema");
const Variant = require("../models/variant-schema");
const Order = require("../models/order-schema");
const Email = require("../models/email-schema");
const Chat = require("../models/chat-schema");

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

exports.getCategoryProducts = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId })
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

exports.getOrders = async (req, res) => {
  try {
    const dbOrders = await Order.find().populate({
      path: "user",
      select: "_id email",
    });

    return res.status(200).json({ success: true, orders: dbOrders });
  } catch (error) {
    console.log("Error getting orders orders for user", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.putUpdateOrderStatus = async (req, res) => {
  const { _id, status } = req.body;

  try {
    // Fetch the order from the database
    const dbOrder = await Order.findById(_id)
      .populate("products.product")
      .populate("products.variant");

    if (!dbOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "Shipped") {
      // Iterate through products in the order
      for (const orderProduct of dbOrder.products) {
        const { product, variant, quantity } = orderProduct;

        // Update the Product model
        const productDoc = await Product.findById(product._id);
        if (productDoc) {
          productDoc.quantity -= quantity;
          if (productDoc.quantity < 0) {
            return res.status(400).json({
              message: `Insufficient stock for product ${productDoc.name}`,
            });
          }
          await productDoc.save();
        }

        // Update the Variant model
        const variantDoc = await Variant.findById(variant._id);
        if (variantDoc) {
          variantDoc.stock -= quantity;
          if (variantDoc.stock < 0) {
            return res.status(400).json({
              message: `Insufficient stock for variant ${variantDoc.sku}`,
            });
          }
          await variantDoc.save();
        }
      }
    }

    // Update the order status
    dbOrder.orderStatus = status;
    await dbOrder.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(400).json({
      message: "An error occurred while updating order status",
      error,
    });
  }
};

exports.getMailAccounts = async (req, res) => {
  const admin = req.admin;

  try {
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(dbAdmin.mail_accounts);
  } catch (error) {
    console.error("Error getting mail accounts", error);
    return res.status(400).json({ message: "Server error", error });
  }
};

exports.postCreateMailAccount = async (req, res) => {
  const admin = req.admin;

  try {
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    dbAdmin.mail_accounts.push(req.body);
    await dbAdmin.save();
    return res
      .status(200)
      .json({ success: true, message: "Successfully created account" });
  } catch (e) {
    console.error("Error posting mail account", e);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.postDeleteMailAccount = async (req, res) => {
  const admin = req.admin;

  try {
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { key } = req.body;

    // Check if the mail account with the given key exists
    const accountIndex = dbAdmin.mail_accounts.findIndex(
      (account) => account.key === key,
    );

    if (accountIndex === -1) {
      return res.status(404).json({ message: "Chat account not found" });
    }

    // Remove the mail account from the array
    dbAdmin.mail_accounts.splice(accountIndex, 1);
    await dbAdmin.save();

    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted account" });
  } catch (e) {
    console.error("Error deleting mail account", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getInboxMails = async (req, res) => {
  try {
    const dbEmails = await Email.find({ isDeleted: false });

    return res.status(200).json(dbEmails);
  } catch (e) {
    console.error("Error getting mails", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getTrashMails = async (req, res) => {
  try {
    const dbEmails = await Email.find({ isDeleted: true });

    return res.status(200).json(dbEmails);
  } catch (e) {
    console.error("Error getting mails", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.putUpdateMsgStatus = async (req, res) => {
  const { status } = req.body;
  const { _id: emailId } = req.params;

  try {
    const dbEmail = await Email.findById(emailId);

    if (!dbEmail) {
      return res.status(400).json({ message: "Chat not found" });
    }

    dbEmail.messages[dbEmail.messages.length - 1].isRead = status;
    await dbEmail.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error updating mail account", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.deleteDeleteMailMsg = async (req, res) => {
  const { _id: emailId } = req.params;
  const { type } = req.body;

  if (!emailId) {
    return res.status(400).json({ message: "Email ID is required" });
  }

  if (!type || (type !== "TRASH" && type !== "DELETE" && type !== "RECOVER")) {
    return res
      .status(400)
      .json({ message: "Invalid or missing type parameter" });
  }

  try {
    const dbEmail = await Email.findById(emailId);

    if (!dbEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (type === "TRASH") {
      dbEmail.isDeleted = true;
      await dbEmail.save();
      return res
        .status(200)
        .json({ success: true, message: "Email moved to trash" });
    }

    if (type === "RECOVER") {
      dbEmail.isDeleted = false;
      await dbEmail.save();
      return res
        .status(200)
        .json({ success: true, message: "Email recovered from trash" });
    }

    await dbEmail.deleteOne(); // Use deleteOne for better clarity
    return res
      .status(200)
      .json({ success: true, message: "Email deleted permanently" });
  } catch (e) {
    console.error("Error processing delete request:", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.postSendMessage = async (req, res) => {
  const { _id, message, apiKey } = req.body;
  const { _id: adminId } = req.admin;

  if (!_id || !message || !apiKey) {
    return res.status(400).json({
      message: "Invalid input: _id, message, and apiKey are required.",
    });
  }

  try {
    const dbAdmin = await Admin.findById(adminId);

    if (!dbAdmin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const postmarkKey = dbAdmin.mail_accounts.find(
      (account) => account._id.toString() === apiKey,
    )?.key;
    const postmarkAccount = dbAdmin.mail_accounts.find(
      (account) => account._id.toString() === postmarkKey,
    )?.name;

    if (!postmarkKey) {
      return res
        .status(400)
        .json({ message: "Invalid API key, please provide a valid key." });
    }

    const dbEmail = await Email.findById(_id);

    if (!dbEmail) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Add the new message from the admin
    const newMessage = {
      sender: "admin",
      message: message,
      sentAt: new Date(),
      isRead: true,
    };

    dbEmail.messages.push(newMessage);
    await dbEmail.save();

    // Prepare the conversation history excluding the current message
    const conversationHistory = dbEmail.messages
      .filter(
        (msg) =>
          msg.message !== message ||
          msg.sentAt.toISOString() !== newMessage.sentAt.toISOString(),
      )
      .map(
        (msg) => `
        <p><strong>${msg.sender === "admin" ? "Support" : dbEmail.participant.name}:</strong> ${msg.message}</p>
        <p><em>Sent at: ${new Date(msg.sentAt).toLocaleString()}</em></p>
        <hr>
      `,
      )
      .join("");

    // Initialize Postmark client
    const postmarkClient = new postmark.ServerClient(postmarkKey);

    // Send an email to the user via Postmark
    await postmarkClient.sendEmail({
      From: postmarkAccount, // Your email address
      To: dbEmail.participant.email,
      Subject: "You have a new message from the Support",
      HtmlBody: `
        <p>Dear ${dbEmail.participant.name},</p>
        <p>You have a new message from the Support. Here is the conversation history:</p>
        ${conversationHistory}
        <p><strong>New message from Support:</strong></p>
        <p><em>${message}</em></p>
      `,
      TextBody: `
        Dear ${dbEmail.participant.name},
        
        You have a new message from the Support. Here is the conversation history:
         
        ${dbEmail.messages
          .filter(
            (msg) =>
              msg.message !== message ||
              msg.sentAt.toISOString() !== newMessage.sentAt.toISOString(),
          )
          .map(
            (msg) =>
              `${
                msg.sender === "admin" ? "Support" : dbEmail.participant.name
              }: ${msg.message}\nSent at: ${new Date(
                msg.sentAt,
              ).toLocaleString()}`,
          )
          .join("\n\n")}
        
        New message from Support:
        ${message}  
      `,
      MessageStream: "outbound",
    });

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error posting send message", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getChatAccounts = async (req, res) => {
  const admin = req.admin;

  try {
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json(dbAdmin.chat_accounts);
  } catch (error) {
    console.error("Error getting chat accounts", error);
    return res.status(400).json({ message: "Server error", error });
  }
};

exports.postCreateChatAccount = async (req, res) => {
  try {
    const admin = req.admin;
    const { name } = req.body;
    const avatar = req.files[0].path;

    if (!name || !avatar) {
      return res.status(400).json({ message: "Invalid name or avatar" });
    }

    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const newAccount = {
      name,
      avatar,
    };

    dbAdmin.chat_accounts.push(newAccount);
    await dbAdmin.save();
    return res
      .status(200)
      .json({ success: true, message: "Successfully created account" });
  } catch (e) {
    console.error("Error posting chat account", e);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteDeleteChatAccount = async (req, res) => {
  const admin = req.admin;

  try {
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { _id } = req.body;

    const accountIndex = dbAdmin.chat_accounts.findIndex(
      (account) => account._id.toString() === _id,
    );

    if (accountIndex === -1) {
      return res.status(404).json({ message: "Chat account not found" });
    }

    // Remove the mail account from the array
    dbAdmin.chat_accounts.splice(accountIndex, 1);
    await dbAdmin.save();

    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted account" });
  } catch (e) {
    console.error("Error deleting chat account", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const dbChats = await Chat.find({ isDeleted: false });

    return res.status(200).json(dbChats);
  } catch (e) {
    console.error("Error getting chats", e);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};

exports.postChatMessage = async (req, res) => {
  const { _id, message, support } = req.body;
  const admin = req.admin;

  try {
    const dbChat = await Chat.findById(_id);
    const dbAdmin = await Admin.findById(admin._id);

    if (!dbChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const supportAccount = dbAdmin.chat_accounts.find(
      (account) => account._id.toString() === support,
    );
    if (!dbChat.isAccepted) {
      dbChat.isAccepted = true;

      const support = {
        name: supportAccount.name,
        avatar: supportAccount.avatar,
      };

      dbChat.support = support;
    }

    const newMessage = {
      sender: "admin",
      message,
      sentAt: new Date(),
    };

    dbChat.messages.push(newMessage);

    await dbChat.save();
    io.getIO().emit("new_chat_message", {
      by: {
        name: dbChat.participant.name,
        role: "admin",
      },
      chatId: dbChat._id,
      message: newMessage,
    });

    return res.status(200).json({ success: true, message: newMessage });
  } catch (e) {
    console.error("Error posting chat message", e);
  }
};

exports.deleteChatMessage = async (req, res) => {
  const { _id } = req.body;

  try {
    const dbChat = await Chat.findByIdAndDelete(_id);

    return res.status(200).json(dbChat);
  } catch (e) {
    console.error("Error deleting chat message", e);
  }
};
