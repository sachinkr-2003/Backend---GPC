const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  propertyRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyRequest',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Razorpay', 'UPI', 'Bank Transfer', 'Cash'],
    default: 'Razorpay'
  },
  transactionId: {
    type: String,
    unique: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema, 'gorakhpur_property_check.payments');