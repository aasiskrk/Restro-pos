const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authGuard");
const validationMiddleware = require("../middleware/validationMiddleware");

// Public routes
router.post(
  "/register",
  validationMiddleware.validateRegistration,
  authController.register
);
router.post("/login", validationMiddleware.validateLogin, authController.login);
router.post(
  "/setup-admin",
  validationMiddleware.validateAdminSetup,
  authController.setupAdmin
);
router.post(
  "/forgot-password",
  validationMiddleware.validateEmail,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validationMiddleware.validateResetPassword,
  authController.resetPassword
);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);
router.put(
  "/update-profile",
  protect,
  validationMiddleware.validateProfileUpdate,
  authController.updateProfile
);
router.put(
  "/change-password",
  protect,
  validationMiddleware.validateChangePassword,
  authController.changePassword
);

// Restaurant routes (admin only)
router.get("/restaurant", protect, authController.getRestaurantDetails);
router.put(
  "/restaurant",
  protect,
  validationMiddleware.validateRestaurantUpdate,
  authController.updateRestaurantDetails
);

module.exports = router;
