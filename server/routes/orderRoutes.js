const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, roleGuard } = require("../middleware/authGuard");
const validationMiddleware = require("../middleware/validationMiddleware");

// Create new order
router.post(
  "/",
  protect,
  roleGuard(["server", "admin"]),
  validationMiddleware.validateOrder,
  orderController.createOrder
);

// Get all orders
router.get("/", protect, orderController.getAllOrders);

// Get order by ID
router.get("/:id", protect, orderController.getOrderById);

// Update order status
router.put(
  "/:id/status",
  protect,
  roleGuard(["kitchen", "admin"]),
  orderController.updateOrderStatus
);

// Update order items
router.put(
  "/:id/items",
  protect,
  roleGuard(["server", "admin"]),
  validationMiddleware.validateOrder,
  orderController.updateOrderItems
);

// Delete order
router.delete(
  "/:id",
  protect,
  roleGuard(["admin"]),
  orderController.deleteOrder
);

// Get orders by status
router.get("/status/:status", protect, orderController.getOrdersByStatus);

// Get orders by date range
router.get("/date-range", protect, orderController.getOrdersByDateRange);

// Get orders by table
router.get("/table/:tableId", protect, orderController.getOrdersByTable);

module.exports = router;
