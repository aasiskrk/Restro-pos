const express = require("express");
const staffController = require("../controllers/staffController");

const router = express.Router();

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
