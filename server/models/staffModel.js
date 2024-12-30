const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["server", "kitchen", "cashier"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
    },
    timing: {
      type: String,
      required: [true, "Work timing is required"],
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
staffSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
