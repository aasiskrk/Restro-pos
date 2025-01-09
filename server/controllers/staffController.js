const Staff = require("../models/staffModel");
const Attendance = require("../models/attendanceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const path = require("path");
const fs = require("fs");

// Staff CRUD Operations
exports.createStaff = catchAsync(async (req, res) => {
  // Get admin and restaurant info from the authenticated user
  const admin = req.user;
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admin can create staff members",
    });
  }

  const staffData = {
    ...req.body,
    admin: admin._id,
    restaurant: admin.restaurant,
  };

  // Handle profile picture upload
  if (req.files && req.files.profilePicture) {
    const profilePic = req.files.profilePicture;
    const imageName = `${Date.now()}-${profilePic.name}`;
    const uploadPath = path.join(__dirname, "../public/staff", imageName);

    try {
      await profilePic.mv(uploadPath);
      staffData.profilePicture = imageName;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return next(new AppError("Error uploading profile picture", 500));
    }
  }

  const newStaff = await Staff.create(staffData);

  // Remove password from response
  newStaff.password = undefined;

  res.status(201).json({
    status: "success",
    data: newStaff,
  });
});

exports.getAllStaff = catchAsync(async (req, res) => {
  // Get staff only for the admin's restaurant
  const admin = req.user;
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admin can view staff members",
    });
  }

  const staff = await Staff.find({
    restaurant: admin.restaurant,
    admin: admin._id,
  }).select("-password");

  res.status(200).json({
    status: "success",
    results: staff.length,
    data: staff,
  });
});

exports.getStaff = catchAsync(async (req, res, next) => {
  const admin = req.user;
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admin can view staff members",
    });
  }

  const staff = await Staff.findOne({
    _id: req.params.id,
    restaurant: admin.restaurant,
    admin: admin._id,
  }).select("-password");

  if (!staff) {
    return next(new AppError("No staff found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: staff,
  });
});

exports.updateStaff = catchAsync(async (req, res, next) => {
  const admin = req.user;
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admin can update staff members",
    });
  }

  const staff = await Staff.findOneAndUpdate(
    {
      _id: req.params.id,
      restaurant: admin.restaurant,
      admin: admin._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!staff) {
    return next(new AppError("No staff found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: staff,
  });
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
  const admin = req.user;
  if (!admin || admin.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Only admin can delete staff members",
    });
  }

  try {
    // First, delete all attendance records for this staff
    await Attendance.deleteMany({ staff: req.params.id });

    // Then delete the staff member completely from the database
    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      restaurant: admin.restaurant,
      admin: admin._id,
    });

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
