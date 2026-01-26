const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const PropertyRequest = require('../models/PropertyRequest');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const { requestId } = req.body;

    // Get property request
    const propertyRequest = await PropertyRequest.findById(requestId);
    if (!propertyRequest) {
      return res.status(404).json({
        success: false,
        message: 'Property request not found'
      });
    }

    // Create Razorpay order
    const options = {
      amount: propertyRequest.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `receipt_${requestId}_${Date.now()}`,
      notes: {
        requestId: requestId,
        serviceType: propertyRequest.serviceType
      }
    };

    const order = await razorpay.orders.create(options);

    // Save payment record
    const payment = new Payment({
      propertyRequest: requestId,
      amount: propertyRequest.amount,
      razorpayOrderId: order.id,
      status: 'Pending'
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update payment record
      const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'Success',
          transactionId: razorpay_payment_id
        },
        { new: true }
      );

      // Update property request payment status
      await PropertyRequest.findByIdAndUpdate(
        payment.propertyRequest,
        { paymentStatus: 'Paid' }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: payment
      });
    } else {
      // Update payment as failed
      await Payment.findByIdAndUpdate(
        paymentId,
        { status: 'Failed' }
      );

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get payment details
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('propertyRequest');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('propertyRequest')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};