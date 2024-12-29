const Inventory = require("../models/inventoryModel");

// Create inventory item
exports.createItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, minThreshold, cost, location } =
      req.body;

    const item = await Inventory.create({
      name,
      category,
      quantity,
      unit,
      minThreshold,
      cost,
      location,
      restaurant: req.user.restaurant,
    });

    res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      item,
    });
  } catch (error) {
    console.error("Create inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating inventory item",
      error: error.message,
    });
  }
};

// Get all inventory items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      restaurant: req.user.restaurant,
    }).sort("category");

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get all inventory items error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting inventory items",
      error: error.message,
    });
  }
};

// Get inventory item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Inventory.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("Get inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting inventory item",
      error: error.message,
    });
  }
};

// Update inventory item
exports.updateItem = async (req, res) => {
  try {
    const { name, category, quantity, unit, minThreshold, cost, location } =
      req.body;

    const item = await Inventory.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurant: req.user.restaurant,
      },
      {
        name,
        category,
        quantity,
        unit,
        minThreshold,
        cost,
        location,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Update inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating inventory item",
      error: error.message,
    });
  }
};

// Delete inventory item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Delete inventory item error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting inventory item",
      error: error.message,
    });
  }
};

// Update stock level
exports.updateStock = async (req, res) => {
  try {
    const { quantity, type } = req.body;

    if (!["add", "subtract"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock update type",
      });
    }

    const item = await Inventory.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    // Update quantity based on type
    if (type === "add") {
      item.quantity += quantity;
    } else {
      if (item.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
      item.quantity -= quantity;
    }

    item.updatedAt = Date.now();
    await item.save();

    res.status(200).json({
      success: true,
      message: "Stock level updated successfully",
      item,
    });
  } catch (error) {
    console.error("Update stock level error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating stock level",
      error: error.message,
    });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const items = await Inventory.find({
      restaurant: req.user.restaurant,
      quantity: { $lte: "$minThreshold" },
    }).sort("quantity");

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Get low stock items error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting low stock items",
      error: error.message,
    });
  }
};
