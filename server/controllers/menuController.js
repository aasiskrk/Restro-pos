const MenuItem = require("../models/menuModel");
const path = require("path");
const fs = require("fs");

// Create menu item
const createMenuItem = async (req, res) => {
  const { name, description, price, category, preparationTime } = req.body;
  let image = null;

  if (!name || !description || !price || !category || !preparationTime) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // Handle image upload if present
    if (req.files && req.files.image) {
      const menuImage = req.files.image;
      const imageName = `${Date.now()}-${menuImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/menu/${imageName}`
      );

      await menuImage.mv(imageUploadPath);
      image = imageName;
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      preparationTime,
      image,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all menu items
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
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

// Get menu items by category
const getMenuItemsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const menuItems = await MenuItem.find({ category });
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

// Update menu item
const updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Handle image upload if present
    if (req.files && req.files.image) {
      const menuImage = req.files.image;
      const imageName = `${Date.now()}-${menuImage.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/menu/${imageName}`
      );

      // Delete old image if exists
      const menuItem = await MenuItem.findById(id);
      if (menuItem.image) {
        const oldImagePath = path.join(
          __dirname,
          `../public/menu/${menuItem.image}`
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      await menuImage.mv(imageUploadPath);
      updateData.image = imageName;
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete menu item
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

// Toggle menu item availability
const toggleAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: `Menu item ${
        menuItem.isAvailable ? "enabled" : "disabled"
      } successfully`,
      menuItem,
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
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
