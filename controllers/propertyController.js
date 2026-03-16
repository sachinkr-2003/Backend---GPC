const PropertyRequest = require('../models/PropertyRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// Get all property requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await PropertyRequest.find()
      .populate('user', 'name email phone')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new property request
exports.createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation Error', errors: errors.array() });
    }

    let { name, email, phone, address, propertyAddress, propertyType, serviceType } = req.body;

    const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
    phone = `+91${normalizedPhone}`;

    if (!email || email.trim() === '') email = undefined;

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ name, email, phone, address });
      await user.save();
    }

    const pricing = { 'Basic': 3000, 'Complete': 5000, 'Premium': 8000 };

    // Attach uploaded documents if any
    const documents = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      uploadedAt: new Date()
    })) : [];

    const propertyRequest = new PropertyRequest({
      user: user._id,
      propertyAddress,
      propertyType,
      serviceType,
      amount: pricing[serviceType],
      documents
    });

    await propertyRequest.save();
    await propertyRequest.populate('user', 'name email phone');

    if (email) {
      await emailService.sendRequestConfirmation(email, {
        name,
        _id: propertyRequest._id,
        propertyAddress,
        serviceType,
        amount: propertyRequest.amount,
        status: propertyRequest.status
      });
    }

    await emailService.sendAdminNotification(propertyRequest);
    await smsService.sendRequestConfirmationSMS(phone, { name, _id: propertyRequest._id, amount: propertyRequest.amount });

    res.status(201).json({
      success: true,
      message: 'Property verification request created successfully',
      data: propertyRequest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single property request
exports.getRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedTo', 'username')
      .populate('verificationReport');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Property request not found' });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update property request (with status change notifications)
exports.updateRequest = async (req, res) => {
  try {
    const oldRequest = await PropertyRequest.findById(req.params.id).populate('user', 'name email phone');
    if (!oldRequest) {
      return res.status(404).json({ success: false, message: 'Property request not found' });
    }

    const request = await PropertyRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    // Send notification if status changed
    if (req.body.status && req.body.status !== oldRequest.status) {
      const user = request.user;
      if (user.email) {
        await emailService.sendStatusUpdate(user.email, {
          name: user.name,
          _id: request._id,
          propertyAddress: request.propertyAddress,
          status: request.status,
          serviceType: request.serviceType
        });
      }
      await smsService.sendStatusUpdateSMS(user.phone, { _id: request._id, status: request.status });
    }

    res.json({ success: true, message: 'Property request updated successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Assign request to admin
exports.assignRequest = async (req, res) => {
  try {
    const { adminId } = req.body;
    const request = await PropertyRequest.findByIdAndUpdate(
      req.params.id,
      { assignedTo: adminId },
      { new: true }
    ).populate('user', 'name email phone').populate('assignedTo', 'username');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Property request not found' });
    }

    res.json({ success: true, message: 'Request assigned successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete property request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Property request not found' });
    }
    res.json({ success: true, message: 'Property request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
