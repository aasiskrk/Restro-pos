const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");
const axios = require("axios");

// eSewa test credentials and endpoints
const ESEWA_TEST_MERCHANT_ID = "EPAYTEST";
const ESEWA_TEST_URL = "https://uat.esewa.com.np/epay/main";
const ESEWA_TEST_SUCCESS_URL = `${process.env.CLIENT_URL}/api/payments/esewa/success`;
const ESEWA_TEST_FAILURE_URL = `${process.env.CLIENT_URL}/api/payments/esewa/failure`;

// Handle cash payment
exports.handleCashPayment = async (req, res) => {
  try {
    const { orderId, amount, amountReceived, change } = req.body;

    // Validate required fields
    if (!orderId || !amount || !amountReceived) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate order hasn't been paid already
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order has already been paid",
      });
    }

    // Create payment record
    const payment = await Payment.create({
      orderId,
      paymentMethod: "cash",
      amount,
      paymentStatus: "completed",
      transactionDetails: {
        amountReceived,
        change,
        notes: `Cash payment - Amount: ${amount}, Received: ${amountReceived}, Change: ${change}`,
      },
    });

    // Update order with payment reference, status, and payment status
    await Order.findByIdAndUpdate(orderId, {
      payment: payment._id,
      status: "completed",
      paymentStatus: "paid",
    });

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Error processing cash payment:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

// Handle QR payment
exports.handleQRPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate order hasn't been paid already
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order has already been paid",
      });
    }

    // Create payment record
    const payment = await Payment.create({
      orderId,
      paymentMethod: "qr",
      amount,
      paymentStatus: "completed",
      transactionDetails: {
        notes: `QR payment - Amount: ${amount}`,
      },
    });

    // Update order with payment reference, status, and payment status
    await Order.findByIdAndUpdate(orderId, {
      payment: payment._id,
      status: "completed",
      paymentStatus: "paid",
    });

    res.status(200).json({
      success: true,
      message: "QR payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Error processing QR payment:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
      error: error.message,
    });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId }).populate("orderId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({
      message: "Error getting payment status",
      error: error.message,
    });
  }
};

// Get all payments with filters
exports.getAllPayments = async (req, res) => {
  try {
    const { paymentMethod, paymentStatus, startDate, endDate, search } =
      req.query;

    // Build query
    const query = {};

    if (paymentMethod && paymentMethod !== "all") {
      query.paymentMethod = paymentMethod;
    }

    if (paymentStatus && paymentStatus !== "all") {
      query.paymentStatus = paymentStatus;
    }

    if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    }

    if (endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
    }

    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "transactionDetails.notes": { $regex: search, $options: "i" } },
      ];
    }

    // Get payments with populated order details including table
    const payments = await Payment.find(query)
      .populate({
        path: "orderId",
        populate: [
          {
            path: "items.menuItem",
            model: "MenuItem",
          },
          {
            path: "table",
            model: "Table",
            select: "number",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error getting payments:", error);
    res.status(500).json({
      success: false,
      message: "Error getting payments",
      error: error.message,
    });
  }
};
