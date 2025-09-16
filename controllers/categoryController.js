const CategoryModel = require("../models/categoryModel");
const slugify = require('slugify')
const fs = require("fs");
const path = require("path");

async function addCategoryController(req, res) {
  try {
    const { name, description, parentCategory } = req.body;
    const {thumbnailImage} = req.file
    const slug = slugify(name, {
      replacement: '-',  
      remove: undefined, 
      lower: true,  
      trim: true        
    })
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new CategoryModel({
      name: name.trim(),
      description,
      parentCategory: parentCategory || null,
      thumbnailImage:`${process.env.SERVER}/${req.file.filename}`
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not create category.",
      error: error.message,
    });
  }
}

async function deleteCategoryController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    // Check if category exists
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete thumbnail image from uploads folder (if exists)
    if (category.thumbnailImage) {
      // Assuming you saved like: `${process.env.SERVER}/uploads/filename.png`
      const fileName = category.thumbnailImage.split("/").pop();
      const filePath = path.join(__dirname, "..", "uploads", fileName);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting thumbnail:", err.message);
        } else {
          console.log("Thumbnail deleted:", fileName);
        }
      });
    }

    // Delete category from DB
    await CategoryModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory: category,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete category.",
      error: error.message,
    });
  }
}

async function updateCategoryController(req, res) {
  try {
    const { id } = req.params;
    const { name, description, parentCategory } = req.body;

    // Find category
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update only provided fields
    if (name) {
      category.name = name.trim();
      category.slug = slugify(name, {
        replacement: "-",
        lower: true,
        trim: true,
      });
    }
    if (description) category.description = description;
    if (parentCategory) category.parentCategory = parentCategory;

    // If a new thumbnail is uploaded, replace it
    if (req.file) {
      if (category.thumbnailImage) {
        const oldFileName = category.thumbnailImage.split("/").pop();
        const oldFilePath = path.join(__dirname, "..", "uploads", oldFileName);

        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old thumbnail:", err.message);
          } else {
            console.log("Old thumbnail deleted:", oldFileName);
          }
        });
      }

      category.thumbnailImage = `${process.env.SERVER}/${req.file.filename}`;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update category.",
      error: error.message,
    });
  }
}
// ✅ Get All Categories
async function getAllCategoriesController(req, res) {
  try {
    const categories = await CategoryModel.find({})
      .populate("parentCategory", "name") // optional populate for nested categories
      .sort({ createdAt: -1 });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch categories.",
      error: error.message,
    });
  }
}

module.exports = { addCategoryController, deleteCategoryController, updateCategoryController, getAllCategoriesController };
