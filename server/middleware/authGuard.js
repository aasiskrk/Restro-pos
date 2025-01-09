const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Staff = require("../models/staffModel");

// Protect routes
const protect = async (req, res, next) => {
  try {
    console.log("=== Auth Protection Debug ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("Found token:", token);
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      console.log(
        "Verifying token with secret:",
        process.env.JWT_SECRET ? "Secret exists" : "Secret missing"
      );
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token data:", JSON.stringify(decoded, null, 2));

      // Check if user is staff
      if (decoded.isStaff) {
        console.log("Processing staff token with ID:", decoded._id);
        // Get staff from token
        const staff = await Staff.findById(decoded._id).select("-password");
        console.log("Found staff in database:", staff ? "Yes" : "No");

        if (!staff) {
          console.log("Staff not found in database for ID:", decoded._id);
          return res.status(401).json({
            success: false,
            message: "Staff not found",
          });
        }

        // Check if staff is active
        if (!staff.isActive) {
          console.log("Staff account is deactivated");
          return res.status(401).json({
            success: false,
            message: "Your account has been deactivated",
          });
        }

        // Add staff to request object with isStaff flag
        req.user = staff;
        req.user.isStaff = true;
        console.log("Staff user set in request:", {
          id: req.user._id,
          role: req.user.role,
          isStaff: req.user.isStaff,
          restaurant: req.user.restaurant,
          admin: req.user.admin,
        });
      } else {
        console.log("Processing admin token with ID:", decoded._id);
        // Get admin user from token
        const user = await User.findById(decoded._id).select("-password");
        console.log("Found admin in database:", user ? "Yes" : "No");

        if (!user) {
          console.log("Admin user not found in database for ID:", decoded._id);
          return res.status(401).json({
            success: false,
            message: "User not found",
          });
        }

        // Check if user is active
        if (!user.isActive) {
          console.log("Admin account is deactivated");
          return res.status(401).json({
            success: false,
            message: "Your account has been deactivated",
          });
        }

        // Add user to request object
        req.user = user;
        req.user.isStaff = false;
        console.log("Admin user set in request:", {
          id: req.user._id,
          role: req.user.role,
          isStaff: req.user.isStaff,
          restaurant: req.user.restaurant,
        });
      }

      console.log("Authentication successful, proceeding to next middleware");
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Auth guard error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error authenticating user",
      error: error.message,
    });
  }
};

// Admin guard middleware
const adminGuard = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin guard error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

// Role-based guard middleware
const roleGuard = (roles) => {
  return async (req, res, next) => {
    try {
      let token;

      // Get token from Authorization header
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Not authorized to access this route",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token in roleGuard:", decoded);

      let user;
      if (decoded.isStaff) {
        // Get staff from token
        user = await Staff.findById(decoded.id).select("-password");
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "Staff not found",
          });
        }

        // Check if staff is active
        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: "Your account has been deactivated",
          });
        }
      } else {
        // Get admin user from token
        user = await User.findById(decoded.id).select("-password");
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found",
          });
        }

        // Check if user is active
        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            message: "Account is deactivated",
          });
        }
      }

      // Check if user has required role
      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized for this role",
        });
      }

      // Add user to request object with isStaff flag
      req.user = user;
      req.user.isStaff = decoded.isStaff;
      next();
    } catch (error) {
      console.error("Role guard error:", error);
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  };
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server Error",
    error: err.message,
  });
};

// File upload middleware
const fileUploadHandler = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  // Check each uploaded file
  Object.values(req.files).forEach((file) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG and GIF are allowed",
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB",
      });
    }
  });

  next();
};

module.exports = {
  protect,
  adminGuard,
  roleGuard,
  errorHandler,
  fileUploadHandler,
};
