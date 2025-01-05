const express = require("express");
const router = express.Router();
const {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  updateTableStatus,
} = require("../controllers/tableController");

// Table routes - all routes accessible without auth temporarily
router.get("/", getAllTables);
router.post("/", createTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);
router.patch("/:id/status", updateTableStatus);

module.exports = router;
