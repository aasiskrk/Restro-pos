const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// Category routes
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Menu item routes
router.post("/items", createMenuItem);
router.get("/items", getAllMenuItems);
router.get("/items/category/:categoryId", getMenuItemsByCategory);
router.put("/items/:id", updateMenuItem);
router.delete("/items/:id", deleteMenuItem);

module.exports = router;
