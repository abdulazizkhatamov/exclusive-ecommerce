const Category = require("../models/category-schema");

exports.getAdmin = async (req, res) => {
  return res.json(req.admin);
};

exports.getCategories = async (req, res) => {
  try {
    // Aggregate to count subcategories and products for each category
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "category",
          as: "subcategories",
        },
      },
      {
        $lookup: {
          from: "products",
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
          createdAt: 1, // Explicitly include createdAt
          updatedAt: 1, // Explicitly include updatedAt
          subcategoryCount: { $size: "$subcategories" },
          productCount: { $size: "$products" },
        },
      },
    ]);

    // Send the response with the categories and counts
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.postCreateCategory = async (req, res) => {
  const { name, description, status } = req.body;

  // Step 1: Validate the request category
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

    // Step 3: Create the category in the database
    const newCategory = await Category.create({
      name,
      description,
      status,
    });

    // Step 4: Return a success response
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
