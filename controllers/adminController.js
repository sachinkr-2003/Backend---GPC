const PropertyRequest = require('../models/PropertyRequest');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Payment = require('../models/Payment');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalRequests = await PropertyRequest.countDocuments();
    const pendingRequests = await PropertyRequest.countDocuments({ status: 'Pending' });
    const completedRequests = await PropertyRequest.countDocuments({ status: 'Completed' });
    const totalUsers = await User.countDocuments();
    
    // Calculate total revenue
    const paidRequests = await PropertyRequest.find({ paymentStatus: 'Paid' });
    const totalRevenue = paidRequests.reduce((sum, request) => sum + request.amount, 0);

    // Recent requests
    const recentRequests = await PropertyRequest.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly stats
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyRequests = await PropertyRequest.countDocuments({
      createdAt: { $gte: currentMonth }
    });

    res.json({
      success: true,
      data: {
        totalRequests,
        pendingRequests,
        completedRequests,
        totalUsers,
        totalRevenue,
        monthlyRequests,
        recentRequests
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

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const admin = new Admin({
      username,
      password,
      role: role || 'Admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this username already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      message: 'Admin updated successfully',
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const requests = await PropertyRequest.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    const summary = {
      totalRequests: requests.length,
      totalRevenue: requests.reduce((sum, req) => sum + req.amount, 0),
      statusBreakdown: {
        pending: requests.filter(req => req.status === 'Pending').length,
        inProgress: requests.filter(req => req.status === 'In Progress').length,
        completed: requests.filter(req => req.status === 'Completed').length,
        cancelled: requests.filter(req => req.status === 'Cancelled').length
      },
      serviceBreakdown: {
        basic: requests.filter(req => req.serviceType === 'Basic').length,
        complete: requests.filter(req => req.serviceType === 'Complete').length,
        premium: requests.filter(req => req.serviceType === 'Premium').length
      }
    };

    res.json({
      success: true,
      data: {
        summary,
        requests: type === 'detailed' ? requests : []
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