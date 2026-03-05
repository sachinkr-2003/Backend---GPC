const mongoose = require('mongoose');

const propertyRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyAddress: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    enum: ['Residential', 'Commercial', 'Agricultural'],
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Basic', 'Complete', 'Premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  documents: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  verificationReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VerificationReport'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PropertyRequest', propertyRequestSchema, 'property_requests');