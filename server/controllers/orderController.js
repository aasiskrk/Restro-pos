const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const { MenuItem } = require("../models/menuModel");

// Create order
const createOrder = async (req, res) => {
  try {
    // Extract data from the nested structure
    const orderData = req.body.tableId || req.body;
    const tableId = orderData.tableId;
    const items = orderData.items;

    console.log("Received order data:", { tableId, items }); // Debug log

    // Validate required fields
    if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Table ID and at least one item are required",
        receivedData: orderData, // Debug info
      });
    }

    // Verify table exists
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Verify all menu items exist and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItemId}`,
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity for menu item",
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes || "",
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Create order
    const order = new Order({
      table: tableId,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: "pending",
      paymentStatus: "unpaid",
    });

    await order.save();

    // Always set table status to occupied when there's an order
    if (table.status === "available") {
      table.status = "occupied";
      table.updatedAt = Date.now();
      await table.save();
    }

    // Populate the order with menu item details
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .populate("table", "number");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order. Please try again.",
      error: error.message,
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .populate("table", "number")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get active orders
const getActiveOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["pending", "in-progress"] },
    })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .populate("table", "number")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get orders by table
const getOrdersByTable = async (req, res) => {
  const { tableId } = req.params;

  try {
    const orders = await Order.find({ table: tableId })
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .populate("table", "number")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { items, status } = req.body;

  try {
    console.log(`Updating order ${id}`, { items, status }); // Debug log

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // If updating items
    if (items && Array.isArray(items)) {
      // Verify all menu items exist and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem) {
          return res.status(404).json({
            success: false,
            message: `Menu item not found: ${item.menuItemId}`,
          });
        }

        if (!item.quantity || item.quantity < 1) {
          return res.status(400).json({
            success: false,
            message: "Invalid quantity for menu item",
          });
        }

        const itemTotal = menuItem.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          price: menuItem.price,
          notes: item.notes || "",
        });
      }

      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax;

      order.items = orderItems;
      order.subtotal = subtotal;
      order.tax = tax;
      order.total = total;
    }

    // If updating status
    if (status) {
      // If order is being completed, reduce stock
      if (status === "completed" && order.status !== "completed") {
        console.log("Processing stock reduction for completed order"); // Debug log

        // Reduce stock for each menu item
        for (const orderItem of order.items) {
          const menuItem = await MenuItem.findById(orderItem.menuItem);
          if (menuItem) {
            console.log(
              `Processing item: Current stock: ${menuItem.stock}, Order quantity: ${orderItem.quantity}`
            ); // Debug log

            // Check if there's enough stock
            if (menuItem.stock < orderItem.quantity) {
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for item: ${menuItem.name}. Available: ${menuItem.stock}, Required: ${orderItem.quantity}`,
              });
            }

            // Reduce the stock
            const newStock = menuItem.stock - orderItem.quantity;
            console.log(`Reducing stock from ${menuItem.stock} to ${newStock}`); // Debug log

            menuItem.stock = newStock;
            await menuItem.save();
          }
        }
      }

      // If order is being completed or cancelled, free up the table
      if ((status === "completed" || status === "cancelled") && order.table) {
        console.log(`Freeing up table for order ${id}`); // Debug log
        await Table.findByIdAndUpdate(order.table, {
          status: "available",
          updatedAt: Date.now(),
        });
      }
      order.status = status;
    }

    order.updatedAt = Date.now();
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate({
        path: "items.menuItem",
        select: "name price stock",
      })
      .populate("table", "number");

    console.log("Order update completed successfully"); // Debug log

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order. Please try again.",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  try {
    console.log(
      `Updating order ${id} to status: ${status}, paymentStatus: ${paymentStatus}`
    ); // Debug log

    const order = await Order.findById(id).populate("items.menuItem");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log(
      `Current order status: ${order.status}, paymentStatus: ${order.paymentStatus}`
    ); // Debug log

    // If order is being completed, reduce stock for each item
    if (status === "completed" && order.status !== "completed") {
      console.log("Processing stock reduction for completed order"); // Debug log

      try {
        // Reduce stock for each menu item
        for (const orderItem of order.items) {
          const menuItem = await MenuItem.findById(orderItem.menuItem);
          if (menuItem) {
            console.log(
              `Processing item ${menuItem.name}: Current stock: ${menuItem.stock}, Order quantity: ${orderItem.quantity}`
            ); // Debug log

            // Check if there's enough stock
            if (menuItem.stock < orderItem.quantity) {
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for item: ${menuItem.name}. Available: ${menuItem.stock}, Required: ${orderItem.quantity}`,
              });
            }

            // Reduce the stock
            const newStock = menuItem.stock - orderItem.quantity;
            console.log(
              `Reducing stock for ${menuItem.name} from ${menuItem.stock} to ${newStock}`
            ); // Debug log

            menuItem.stock = newStock;
            await menuItem.save();

            console.log(`Stock updated successfully for ${menuItem.name}`); // Debug log
          }
        }
        console.log("Stock reduction completed successfully"); // Debug log
      } catch (error) {
        console.error("Error updating stock:", error);
        return res.status(500).json({
          success: false,
          message: "Error updating stock",
          error: error.message,
        });
      }
    }

    // Update order status and payment status
    const updateData = {
      status: status,
      updatedAt: Date.now(),
    };

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    // Update the order with all changes at once
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate({
        path: "items.menuItem",
        select: "name price stock",
      })
      .populate("table", "number");

    // If order is completed or cancelled, free up the table
    if ((status === "completed" || status === "cancelled") && order.table) {
      console.log(`Freeing up table for order ${id}`); // Debug log
      await Table.findByIdAndUpdate(order.table, {
        status: "available",
        updatedAt: Date.now(),
      });
    }

    console.log("Order update completed successfully"); // Debug log

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// Add items to order
const addItemsToOrder = async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Verify all menu items exist and calculate totals
    let additionalSubtotal = 0;
    const newItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItemId}`,
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      additionalSubtotal += itemTotal;

      newItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
        notes: item.notes,
      });
    }

    const additionalTax = additionalSubtotal * 0.08; // 8% tax

    // Update order
    order.items.push(...newItems);
    order.subtotal += additionalSubtotal;
    order.tax += additionalTax;
    order.total = order.subtotal + order.tax;
    order.updatedAt = Date.now();

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate({
        path: "items.menuItem",
        select: "name price",
      })
      .populate("table", "number");

    res.status(200).json({
      success: true,
      message: "Items added to order successfully",
      order: updatedOrder,
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
  createOrder,
  getAllOrders,
  getActiveOrders,
  getOrdersByTable,
  updateOrder,
  updateOrderStatus,
  addItemsToOrder,
};
