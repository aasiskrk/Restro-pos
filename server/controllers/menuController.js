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
  const { name, description, price, category, stock } = req.body;
  let image = null;

  if (!name || !description || !price || !category || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
      });
    }

    // Handle image upload if present
    if (req.files && req.files.image) {
      const menuImage = req.files.image;
      const imageName = `${Date.now()}-${menuImage.name}`;
      const imageUploadPath = path.join(__dirname, "../public/menu", imageName);

      try {
        await menuImage.mv(imageUploadPath);
        image = imageName;
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
        });
      }
    }

    const menuItem = new MenuItem({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      image,
    });

    await menuItem.save();

    const populatedMenuItem = await MenuItem.findById(menuItem._id).populate(
      "category",
      "name"
    );

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem: populatedMenuItem,
    });
  } catch (error) {
    // Delete uploaded image if menu item creation fails
    if (image) {
      const imagePath = path.join(__dirname, "../public/menu", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.image; // Remove image from updateData as we'll handle it separately

  try {
    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (updateData.category) {
      // Verify category exists
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
    }

    // Convert price and stock to numbers
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);

    // Handle image upload if present
    if (req.files && req.files.image) {
      const menuImage = req.files.image;
      const imageName = `${Date.now()}-${menuImage.name}`;
      const imageUploadPath = path.join(__dirname, "../public/menu", imageName);

      try {
        // Delete old image if exists
        if (menuItem.image) {
          const oldImagePath = path.join(
            __dirname,
            "../public/menu",
            menuItem.image
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Upload new image
        await menuImage.mv(imageUploadPath);
        updateData.image = imageName;
      } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
        });
      }
    }

    // Update the menu item and populate category
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    ).populate("category", "name");

    if (!updatedMenuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
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
