const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "Table number is required"],
    unique: true,
    min: [1, "Table number must be greater than 0"],
  },
  seats: {
    type: Number,
    required: [true, "Number of seats is required"],
    min: [1, "Number of seats must be greater than 0"],
  },
  status: {
    type: String,
    enum: ["available", "occupied"],
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Remove old indexes and create a new one
tableSchema.index({ number: 1 }, { unique: true, name: "number_1" });

const Table = mongoose.model("Table", tableSchema);

// Drop existing indexes and create new ones
Table.collection
  .dropIndexes()
  .catch((err) => console.log("No indexes to drop"));

module.exports = Table;
