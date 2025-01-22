const express = require("express");
const router = express.Router();
const {
  initiateEsewaPayment,
  handleEsewaSuccess,
  handleEsewaFailure,
  getPaymentStatus,
  handleCashPayment,
  handleQRPayment,
  getAllPayments,
} = require("../controllers/paymentController");

// Payment routes
router.get("/", getAllPayments);
router.post("/cash", handleCashPayment);
router.post("/qr", handleQRPayment);


module.exports = router;
