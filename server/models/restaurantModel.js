const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ["small", "medium", "large", "xlarge"],
    default: "small",
  },
  type: {
    type: String,
    enum: [
      "restaurant",
      "cafe",
      "bar",
      "fastfood",
      "teahouse",
      "bakery",
      "pizzeria",
      "buffet",
      "foodtruck",
    ],
    default: "restaurant",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  logo: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
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

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
