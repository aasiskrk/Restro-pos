const Table = require("../models/tableModel");

// Create new table
exports.createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, section } = req.body;

    const table = await Table.create({
      tableNumber,
      capacity,
      section,
      status: "available",
      restaurant: req.user.restaurant,
    });

    res.status(201).json({
      success: true,
      message: "Table created successfully",
      table,
    });
  } catch (error) {
    console.error("Create table error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating table",
      error: error.message,
    });
  }
};

// Get all tables
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ restaurant: req.user.restaurant })
      .populate("currentOrder")
      .sort("tableNumber");

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error("Get all tables error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting tables",
      error: error.message,
    });
  }
};

// Get table by ID
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    }).populate("currentOrder");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      table,
    });
  } catch (error) {
    console.error("Get table error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting table",
      error: error.message,
    });
  }
};

// Update table
exports.updateTable = async (req, res) => {
  try {
    const { tableNumber, capacity, section } = req.body;

    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurant: req.user.restaurant,
      },
      {
        tableNumber,
        capacity,
        section,
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("currentOrder");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table,
    });
  } catch (error) {
    console.error("Update table error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating table",
      error: error.message,
    });
  }
};

// Delete table
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    console.error("Delete table error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting table",
      error: error.message,
    });
  }
};

// Get available tables
exports.getAvailableTables = async (req, res) => {
  try {
    const tables = await Table.find({
      restaurant: req.user.restaurant,
      status: "available",
    }).sort("tableNumber");

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error("Get available tables error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting available tables",
      error: error.message,
    });
  }
};

// Get occupied tables
exports.getOccupiedTables = async (req, res) => {
  try {
    const tables = await Table.find({
      restaurant: req.user.restaurant,
      status: "occupied",
    })
      .populate("currentOrder")
      .sort("tableNumber");

    res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error("Get occupied tables error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting occupied tables",
      error: error.message,
    });
  }
};

// Update table status
exports.updateTableStatus = async (req, res) => {
  try {
    const { status, orderId } = req.body;
    const validStatuses = ["available", "occupied", "reserved", "maintenance"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table status",
      });
    }

    const updateData = {
      status,
      updatedAt: Date.now(),
    };

    // If status is occupied, add the order reference
    if (status === "occupied" && orderId) {
      updateData.currentOrder = orderId;
    }

    // If status is available, remove the order reference
    if (status === "available") {
      updateData.currentOrder = null;
    }

    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurant: req.user.restaurant,
      },
      updateData,
      { new: true }
    ).populate("currentOrder");

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Table status updated successfully",
      table,
    });
  } catch (error) {
    console.error("Update table status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating table status",
      error: error.message,
    });
  }
};
