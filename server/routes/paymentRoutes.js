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
router.post("/esewa/initiate", initiateEsewaPayment);
router.get("/esewa/success", handleEsewaSuccess);
router.get("/esewa/failure", handleEsewaFailure);
router.get("/status/:orderId", getPaymentStatus);

module.exports = router;
