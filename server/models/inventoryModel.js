const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["ingredients", "supplies", "equipment"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  minThreshold: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: false,
  },
  location: {
    type: String,
    required: true,
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

const Inventory = mongoose.model("Inventory", inventoryItemSchema);
module.exports = Inventory;
