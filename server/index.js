const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./database/database");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const staffRoutes = require("./routes/staffRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const AppError = require("./utils/appError");
const path = require("path");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const tableRoutes = require("./routes/tableRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Creating an express app
const app = express();

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// JSON Config
app.use(express.json());

// File upload config
app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 5MB max file size
    },
    abortOnLimit: true,
  })
);

// Make public folder accessible
app.use(express.static("./public"));

// CORS config
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Configuration dotenv
dotenv.config();

// Connecting to database
connectDB();

// Defining the port
const PORT = process.env.PORT || 5000;

// Create upload directories if they don't exist
const fs = require("fs");
const uploadDirs = [
  path.join(__dirname, "public/uploads/users"),
  path.join(__dirname, "public/uploads/staff"),
  path.join(__dirname, "public/menu"),
  path.join(__dirname, "public/staff")
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve static files from the public directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/menu", express.static(path.join(__dirname, "public/menu")));
app.use("/staff", express.static(path.join(__dirname, "public/staff")));

// Configuring routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/menu", menuRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}
API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
