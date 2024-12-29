const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { protect, roleGuard } = require("../middleware/authGuard");
const validationMiddleware = require("../middleware/validationMiddleware");

// Create new table
router.post(
  "/",
  protect,
  roleGuard(["admin"]),
  validationMiddleware.validateTable,
  tableController.createTable
);

// Get all tables
router.get("/", protect, tableController.getAllTables);

// Get table by ID
router.get("/:id", protect, tableController.getTableById);

// Update table
router.put(
  "/:id",
  protect,
  roleGuard(["admin"]),
  validationMiddleware.validateTable,
  tableController.updateTable
);

// Delete table
router.delete(
  "/:id",
  protect,
  roleGuard(["admin"]),
  tableController.deleteTable
);

// Get available tables
router.get("/status/available", protect, tableController.getAvailableTables);

// Get occupied tables
router.get("/status/occupied", protect, tableController.getOccupiedTables);

// Update table status
router.put(
  "/:id/status",
  protect,
  roleGuard(["server", "admin"]),
  tableController.updateTableStatus
);

module.exports = router;
