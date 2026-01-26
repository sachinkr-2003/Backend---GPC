const PropertyRequest = require('../models/PropertyRequest');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const emailService = require('../services/emailService');

// Get all property requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await PropertyRequest.find()
      .populate('user', 'name email phone')
      .populate('assignedTo', 'username')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new property request
exports.createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: errors.array()
      });
    }

    const { name, email, phone, address, propertyAddress, propertyType, serviceType } = req.body;

    // Create or find user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ name, email, phone, address });
      await user.save();
    }

    // Calculate amount based on service type
    const pricing = {
      'Basic': 3000,
      'Complete': 5000,
      'Premium': 8000
    };

    const propertyRequest = new PropertyRequest({
      user: user._id,
      propertyAddress,
      propertyType,
      serviceType,
      amount: pricing[serviceType]
    });

    await propertyRequest.save();
    await propertyRequest.populate('user', 'name email phone');

    // Send confirmation email
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

    // Send admin notification
    await emailService.sendAdminNotification(propertyRequest);

    res.status(201).json({
      success: true,
      message: 'Property verification request created successfully',
      data: propertyRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get single property request
exports.getRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('assignedTo', 'username');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Property request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update property request
exports.updateRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Property request not found'
      });
    }

    res.json({
      success: true,
      message: 'Property request updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete property request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await PropertyRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Property request not found'
      });
    }

    res.json({
      success: true,
      message: 'Property request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};