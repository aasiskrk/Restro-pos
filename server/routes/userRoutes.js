const router = require("express").Router();
const userController = require("../controllers/userController");
const { authGuard, adminGuard } = require("../middleware/authGuard");

// Admin only routes
router.get("/all", adminGuard, userController.getAllUsers);
router.get("/user/:id", adminGuard, userController.getUserById);
router.patch("/role/:id", adminGuard, userController.updateUserRole);
router.patch("/toggle-status/:id", adminGuard, userController.toggleUserStatus);
router.delete("/delete/:id", adminGuard, userController.deleteUser);
router.get("/role/:role", adminGuard, userController.getUsersByRole);
router.put("/schedule/:id", adminGuard, userController.updateWorkSchedule);

// Search users (admin only)
router.get("/search", adminGuard, userController.searchUsers);

module.exports = router;
