// Validation middleware for user registration
const validateRegistration = (req, res, next) => {
  const { restaurantName, ownerName, size, type, phone, email, password } =
    req.body;

  if (
    !restaurantName ||
    !ownerName ||
    !size ||
    !type ||
    !phone ||
    !email ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  // Validate phone number format
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number",
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  next();
};

const validateAdminSetup = (req, res, next) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  // Validate phone number format
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number",
    });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { fullName, phone, location } = req.body;

  // All fields are optional, but if phone is provided, validate its format
  if (phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide current and new password",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide email address",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  next();
};

const validateResetPassword = (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide token and new password",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  next();
};

const validateRestaurantUpdate = (req, res, next) => {
  console.log("Validation Middleware - Request Body:", req.body);

  // All fields are optional for updates
  const { restaurantName, ownerName, email, phone, address } = req.body;

  // Log extracted fields
  console.log("Validation Middleware - Extracted Fields:", {
    restaurantName,
    ownerName,
    email,
    phone,
    address,
  });

  // Validate phone number format if provided
  if (phone) {
    console.log("Validating phone number:", phone);
    // Allow any non-empty string for phone number
    if (typeof phone !== "string" || phone.trim().length === 0) {
      console.log("Phone validation failed");
      return res.status(400).json({
        success: false,
        message: "Phone number cannot be empty",
      });
    }
  }

  // Validate email format if provided
  if (email) {
    console.log("Validating email:", email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Email validation failed");
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }
  }

  console.log("Validation passed, proceeding to next middleware");
  next();
};

const validateTable = (req, res, next) => {
  const { tableNumber, capacity, section } = req.body;

  if (!tableNumber || !capacity || !section) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (capacity < 1) {
    return res.status(400).json({
      success: false,
      message: "Capacity must be at least 1",
    });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { tableId, items } = req.body;

  if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide table and at least one item",
    });
  }

  // Validate each item
  for (const item of items) {
    if (!item.menuItem || !item.quantity || item.quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Each item must have a menu item and quantity greater than 0",
      });
    }
  }

  next();
};

const validateInventoryItem = (req, res, next) => {
  const { name, category, quantity, unit, minThreshold, cost, location } =
    req.body;

  if (
    !name ||
    !category ||
    !quantity ||
    !unit ||
    !minThreshold ||
    !cost ||
    !location
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Validate quantity and minThreshold
  if (quantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity cannot be negative",
    });
  }

  if (minThreshold < 0) {
    return res.status(400).json({
      success: false,
      message: "Minimum threshold cannot be negative",
    });
  }

  // Validate cost
  if (cost < 0) {
    return res.status(400).json({
      success: false,
      message: "Cost cannot be negative",
    });
  }

  // Validate category
  const validCategories = ["ingredients", "supplies", "equipment"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid category. Must be one of: ingredients, supplies, equipment",
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateAdminSetup,
  validateProfileUpdate,
  validateChangePassword,
  validateEmail,
  validateResetPassword,
  validateRestaurantUpdate,
  validateTable,
  validateOrder,
  validateInventoryItem,
};
