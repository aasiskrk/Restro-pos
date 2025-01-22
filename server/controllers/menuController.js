const { MenuItem, Category } = require("../models/menuModel");
const path = require("path");
const fs = require("fs");

// Category Controllers
const createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  try {
    const category = new Category({
      name,
      description,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, updatedAt: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category has menu items
    const menuItems = await MenuItem.find({ category: id });
    if (menuItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with existing menu items",
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Menu Item Controllers
const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, stock } = req.body;

    // Validate required fields
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Name, category, and price are required",
      });
    }

    let imageFileName = null;

    // Handle image upload
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Validate file type
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image file",
        });
      }

      // Create unique filename
      imageFileName = `menu-${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(__dirname, "../public/menu");
      const uploadPath = path.join(uploadDir, imageFileName);

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move the file
      await file.mv(uploadPath);
    }

    const menuItem = new MenuItem({
      name,
      description,
      category,
      price,
      stock,
      image: imageFileName,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error creating menu item",
      error: error.message,
    });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({}).populate("category", "name");
    res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMenuItemsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const menuItems = await MenuItem.find({ category: categoryId }).populate(
      "category",
      "name"
    );
    res.status(200).json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle image upload
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Validate file type
      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Please upload an image file",
        });
      }

      // Create unique filename
      const imageFileName = `menu-${Date.now()}${path.extname(file.name)}`;
      const uploadDir = path.join(__dirname, "../public/menu");
      const uploadPath = path.join(uploadDir, imageFileName);

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Delete old image if exists
      const oldMenuItem = await MenuItem.findById(id);
      if (oldMenuItem && oldMenuItem.image) {
        const oldImagePath = path.join(uploadDir, oldMenuItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Move the new file
      await file.mv(uploadPath);
      updateData.image = imageFileName;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu item",
      error: error.message,
    });
  }
};

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Delete associated image if exists
    if (menuItem.image) {
      const imagePath = path.join(
        __dirname,
        `../public/menu/${menuItem.image}`
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MenuItem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  // Category controllers
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  // Menu item controllers
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
};
