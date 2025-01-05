const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getActiveOrders,
  getOrdersByTable,
  updateOrder,
  updateOrderStatus,
  addItemsToOrder,
} = require("../controllers/orderController");

// Order routes
router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/active", getActiveOrders);
router.get("/table/:tableId", getOrdersByTable);
router.put("/:id", updateOrder);
router.patch("/:id/status", updateOrderStatus);
router.post("/:id/items", addItemsToOrder);

module.exports = router;
