// Importing the package
const mongoose = require("mongoose");

//  Creating a function
const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((error) => {
      console.error("Database Connection Error:", error);
      process.exit(1); // Exit process with failure
    });
};

// Exporting the function
module.exports = connectDB;
