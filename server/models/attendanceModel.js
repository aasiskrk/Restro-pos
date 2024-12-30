const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Staff reference is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-shift", "leave", "off-work"],
      default: "absent",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
