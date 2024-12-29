const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");

// Register a new restaurant
exports.register = async (req, res) => {
  try {
    const { restaurantName, ownerName, size, type, email, phone, password } =
      req.body;

    // Check if restaurant with email already exists
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant with this email already exists",
      });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      restaurantName,
      ownerName,
      size,
      type,
      email,
      phone,
    });

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering restaurant",
      error: error.message,
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).populate("restaurant");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user role matches
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role for this user",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpires;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Setup admin user
exports.setupAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;

    // Find restaurant by email
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check if admin already exists for this restaurant
    const existingAdmin = await User.findOne({
      restaurant: restaurant._id,
      role: "admin",
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists for this restaurant",
      });
    }

    // Create admin user
    const admin = new User({
      fullName,
      email,
      phone,
      password,
      role: "admin",
      address,
      restaurant: restaurant._id,
      isActive: true,
    });

    await admin.save();

    // Update restaurant with admin reference
    restaurant.admin = admin._id;
    await restaurant.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive data
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    delete adminResponse.resetPasswordToken;
    delete adminResponse.resetPasswordExpires;

    res.status(201).json({
      success: true,
      message: "Admin setup successful",
      token,
      user: adminResponse,
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting up admin",
      error: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate("restaurant");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting current user",
      error: error.message,
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// Request password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send reset email

    res.status(200).json({
      success: true,
      message: "Password reset instructions sent to email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting password reset",
      error: error.message,
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// Get restaurant details for admin
exports.getRestaurantDetails = async (req, res) => {
  try {
    // Get user with populated restaurant data
    const user = await User.findById(req.user.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .populate({
        path: "restaurant",
        select:
          "restaurantName ownerName size type email phone address isActive createdAt",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can access restaurant details",
      });
    }

    if (!user.restaurant) {
      return res.status(404).json({
        success: false,
        message: "No restaurant found for this admin",
      });
    }

    res.status(200).json({
      success: true,
      restaurant: user.restaurant,
    });
  } catch (error) {
    console.error("Get restaurant details error:", error);
    res.status(500).json({
      success: false,
      message: "Error getting restaurant details",
      error: error.message,
    });
  }
};

// Update restaurant details
exports.updateRestaurantDetails = async (req, res) => {
  try {
    console.log("Controller - Request Body:", req.body);
    const { restaurantName, ownerName, email, phone, address } = req.body;

    // Get user with populated restaurant data
    const user = await User.findById(req.user.id).populate("restaurant");
    console.log("Controller - Found User:", user);

    if (!user) {
      console.log("Controller - User not found");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      console.log("Controller - User is not admin:", user.role);
      return res.status(403).json({
        success: false,
        message: "Only admin can update restaurant details",
      });
    }

    if (!user.restaurant) {
      console.log("Controller - No restaurant found for user");
      return res.status(404).json({
        success: false,
        message: "No restaurant found for this admin",
      });
    }

    // Create update object with only provided fields
    const updateData = {};
    if (restaurantName) updateData.restaurantName = restaurantName;
    if (ownerName) updateData.ownerName = ownerName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    updateData.updatedAt = Date.now();

    console.log("Controller - Update Data:", updateData);

    // Update restaurant details
    const restaurant = await Restaurant.findByIdAndUpdate(
      user.restaurant._id,
      updateData,
      { new: true }
    );

    console.log("Controller - Updated Restaurant:", restaurant);

    res.status(200).json({
      success: true,
      message: "Restaurant details updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update restaurant details error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating restaurant details",
      error: error.message,
    });
  }
};
