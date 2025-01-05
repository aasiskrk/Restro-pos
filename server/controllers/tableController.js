const Table = require("../models/tableModel");
const Order = require("../models/orderModel");

// Create table
const createTable = async (req, res) => {
  const { number, seats } = req.body;

  try {
    // Validate required fields
    if (!number || !seats) {
      return res.status(400).json({
        success: false,
        message: "Table number and seats are required",
      });
    }

    // Convert to numbers and validate
    const tableNumber = Number(number);
    const seatCount = Number(seats);

    if (isNaN(tableNumber) || tableNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid table number. Must be a positive number.",
      });
    }

    if (isNaN(seatCount) || seatCount < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid seat count. Must be a positive number.",
      });
    }

    // Check if table number already exists
    const existingTable = await Table.findOne({ number: tableNumber });
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: `Table number ${tableNumber} already exists`,
      });
    }

    const table = new Table({
      number: tableNumber,
      seats: seatCount,
    });

    await table.save();

    res.status(201).json({
      success: true,
      message: "Table created successfully",
      table,
    });
  } catch (error) {
    console.error("Error creating table:", error);
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Table number ${number} already exists`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating table. Please try again.",
      error: error.message,
    });
  }
};

// Get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({}).sort({ number: 1 });
    res.status(200).json({
      success: true,
      tables,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update table
const updateTable = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // If updating table number, check if it already exists
    if (updateData.number) {
      const existingTable = await Table.findOne({
        number: updateData.number,
        _id: { $ne: id },
      });
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: "Table number already exists",
        });
      }
    }

    const table = await Table.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete table
const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if table has active orders
    const activeOrder = await Order.findOne({
      table: id,
      status: { $in: ["pending", "in-progress"] },
    });

    if (activeOrder) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete table with active orders",
      });
    }

    const table = await Table.findByIdAndDelete(id);

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
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update table status
const updateTableStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { status } = req.body;

    if (!tableId || !status) {
      return res.status(400).json({
        success: false,
        message: "Table ID and status are required",
      });
    }

    const table = await Table.findByIdAndUpdate(
      tableId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

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
    console.error("Error updating table status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating table status",
    });
  }
};

module.exports = {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  updateTableStatus,
};
