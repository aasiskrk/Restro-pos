const Staff = require("../models/staffModel");
const Attendance = require("../models/attendanceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

// Staff CRUD Operations
exports.createStaff = catchAsync(async (req, res, next) => {
  try {
    console.log("Creating staff with data:", req.body);
    console.log("Files received:", req.files);

    const staffData = {
      ...req.body,
      admin: req.body.admin, // Default admin ID
      restaurant: req.body.restaurant, // Default restaurant ID
    };

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      const profilePic = req.files.profilePicture;

      // Validate file type
      if (!profilePic.mimetype.startsWith("image/")) {
        return next(new AppError("Please upload an image file", 400));
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../public/staff");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imageName = `staff-${Date.now()}${path.extname(profilePic.name)}`;
      const uploadPath = path.join(uploadDir, imageName);

      try {
        await profilePic.mv(uploadPath);
        staffData.profilePicture = imageName;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        return next(new AppError("Error uploading profile picture", 500));
      }
    }

    // Create staff in database
    const newStaff = await Staff.create(staffData);

    // Remove password from response
    newStaff.password = undefined;

    res.status(201).json({
      status: "success",
      data: newStaff,
    });
  } catch (error) {
    console.error("Error in createStaff:", error);
    return next(new AppError(error.message || "Error creating staff", 500));
  }
});

exports.getAllStaff = catchAsync(async (req, res) => {
  const staff = await Staff.find().select("-password");

  res.status(200).json({
    status: "success",
    results: staff.length,
    data: staff,
  });
});

exports.getStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id).select("-password");

  if (!staff) {
    return next(new AppError("No staff found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: staff,
  });
});

exports.updateStaff = catchAsync(async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Handle password update
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password; // Don't update password if not provided
    }

    // Handle file upload
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture;

      // Validate file type
      if (!file.mimetype.startsWith("image/")) {
        return next(new AppError("Please upload an image file", 400));
      }

      // Create unique filename
      const fileName = `staff-${req.params.id}-${Date.now()}${path.extname(
        file.name
      )}`;
      const uploadDir = path.join(__dirname, "../public/staff");
      const uploadPath = path.join(uploadDir, fileName);

      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Delete old profile picture if exists
      const oldStaff = await Staff.findById(req.params.id);
      if (oldStaff && oldStaff.profilePicture) {
        const oldPicturePath = path.join(uploadDir, oldStaff.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      // Move the new file
      await file.mv(uploadPath);
      updateData.profilePicture = fileName;
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!staff) {
      return next(new AppError("No staff found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: staff,
    });
  } catch (error) {
    console.error("Error in updateStaff:", error);
    return next(new AppError(error.message || "Error updating staff", 500));
  }
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
  try {
    // First, delete all attendance records for this staff
    await Attendance.deleteMany({ staff: req.params.id });

    // Then delete the staff member completely from the database
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return next(new AppError("No staff found with that ID", 404));
    }

    // If staff has a profile picture, delete it
    if (staff.profilePicture) {
      const picturePath = path.join(
        __dirname,
        "../public/staff",
        staff.profilePicture
      );
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return next(new AppError("Error deleting staff member", 500));
  }
});

// Attendance Management
exports.getAttendanceHistory = catchAsync(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get today's attendance for all staff
  const attendance = await Attendance.find({
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  }).populate("staff", "fullName role");

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: attendance,
  });
});

exports.updateAttendanceStatus = catchAsync(async (req, res, next) => {
  const { staffId, status } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find or create today's attendance record
  let attendance = await Attendance.findOne({
    staff: staffId,
    date: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
    },
  });

  if (!attendance) {
    // Create new attendance record if none exists for today
    attendance = await Attendance.create({
      staff: staffId,
      date: today,
      status,
    });
  } else {
    // Update existing attendance record
    attendance.status = status;
    await attendance.save();
  }

  // Populate staff details
  attendance = await attendance.populate("staff", "fullName role");

  res.status(200).json({
    status: "success",
    data: attendance,
  });
});

// Update staff profile picture
exports.updateStaffProfilePicture = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({
        status: "fail",
        message: "No profile picture uploaded",
      });
    }

    const file = req.files.profilePicture;
    const staff = req.user;

    // Validate file type
    if (!file.mimetype.startsWith("image")) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload an image file",
      });
    }

    // Create unique filename
    const fileName = `staff-${staff._id}-${Date.now()}${path.extname(
      file.name
    )}`;
    const uploadPath = path.join(
      __dirname,
      "../public/uploads/staff",
      fileName
    );

    // Create directory if it doesn't exist
    const uploadDir = path.join(__dirname, "../public/uploads/staff");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move file to upload directory
    await file.mv(uploadPath);

    // Update staff profile picture in database
    staff.profilePicture = `/uploads/staff/${fileName}`;
    await staff.save();

    res.status(200).json({
      status: "success",
      data: {
        profilePicture: staff.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      status: "error",
      message: "Error updating profile picture",
    });
  }
};
