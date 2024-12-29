const Order = require("../models/orderModel");

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { tableId, items, specialInstructions } = req.body;

    const order = await Order.create({
      table: tableId,
      items,
      specialInstructions,
      status: "pending",
      server: req.user.id,
      restaurant: req.user.restaurant,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.restaurant })
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    })
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting order",
      error: error.message,
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "served",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        restaurant: req.user.restaurant,
      },
      {
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    )
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Update order items
exports.updateOrderItems = async (req, res) => {
  try {
    const { items, specialInstructions } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Can only update pending orders",
      });
    }

    order.items = items;
    order.specialInstructions = specialInstructions;
    order.updatedAt = Date.now();

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order items error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order items",
      error: error.message,
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      restaurant: req.user.restaurant,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = [
      "pending",
      "preparing",
      "ready",
      "served",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const orders = await Order.find({
      restaurant: req.user.restaurant,
      status,
    })
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};

// Get orders by date range
exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide start and end dates",
      });
    }

    const orders = await Order.find({
      restaurant: req.user.restaurant,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by date range error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};

// Get orders by table
exports.getOrdersByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    const orders = await Order.find({
      restaurant: req.user.restaurant,
      table: tableId,
    })
      .populate("table")
      .populate("server", "fullName")
      .populate("items.menuItem");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders by table error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};
