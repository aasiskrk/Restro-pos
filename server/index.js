const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./database/database");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const staffRoutes = require("./routes/staffRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const AppError = require("./utils/appError");

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
app.use(fileUpload());

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

// Configuring routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
app.use("/api/table", require("./routes/tableRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/staff", staffRoutes);

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
