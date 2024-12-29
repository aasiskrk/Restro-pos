const router = require("express").Router();
const menuController = require("../controllers/menuController");
const { authGuard, adminGuard } = require("../middleware/authGuard");

// Create menu item (admin only)
router.post("/create", adminGuard, menuController.createMenuItem);

// Get all menu items
router.get("/all", menuController.getAllMenuItems);

// Get menu items by category
router.get("/category/:category", menuController.getMenuItemsByCategory);

// Update menu item (admin only)
router.put("/update/:id", adminGuard, menuController.updateMenuItem);

// Delete menu item (admin only)
router.delete("/delete/:id", adminGuard, menuController.deleteMenuItem);

// Toggle menu item availability (admin only)
router.patch("/toggle/:id", adminGuard, menuController.toggleAvailability);

module.exports = router;
