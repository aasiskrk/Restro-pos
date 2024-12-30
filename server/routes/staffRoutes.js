const express = require("express");
const staffController = require("../controllers/staffController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Staff management routes (restricted to admin)
router.use(restrictTo("admin"));

// Attendance routes
router.get("/attendance-history", staffController.getAttendanceHistory);
router.put("/attendance", staffController.updateAttendanceStatus);

router
  .route("/")
  .get(staffController.getAllStaff)
  .post(staffController.createStaff);

router
  .route("/:id")
  .get(staffController.getStaff)
  .patch(staffController.updateStaff)
  .delete(staffController.deleteStaff);

module.exports = router;
