const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { protect, roleGuard } = require("../middleware/authGuard");
const validationMiddleware = require("../middleware/validationMiddleware");

// Create inventory item
router.post(
  "/",
  protect,
  roleGuard(["admin"]),
  validationMiddleware.validateInventoryItem,
  inventoryController.createItem
);

// Get all inventory items
router.get("/", protect, inventoryController.getAllItems);

// Get inventory item by ID
router.get("/:id", protect, inventoryController.getItemById);

// Update inventory item
router.put(
  "/:id",
  protect,
  roleGuard(["admin"]),
  validationMiddleware.validateInventoryItem,
  inventoryController.updateItem
);

// Delete inventory item
router.delete(
  "/:id",
  protect,
  roleGuard(["admin"]),
  inventoryController.deleteItem
);

// Update stock level
router.put(
  "/:id/stock",
  protect,
  roleGuard(["admin"]),
  inventoryController.updateStock
);

// Get low stock items
router.get("/status/low-stock", protect, inventoryController.getLowStockItems);

module.exports = router;
