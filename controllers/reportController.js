const VerificationReport = require('../models/VerificationReport');
const PropertyRequest = require('../models/PropertyRequest');
const reportService = require('../services/reportService');
const emailService = require('../services/emailService');

// Create verification report
exports.createReport = async (req, res) => {
  try {
    const { propertyRequestId, findings, govRecords, expertComments, recommendation } = req.body;

    const propertyRequest = await PropertyRequest.findById(propertyRequestId).populate('user', 'name email phone');
    if (!propertyRequest) {
      return res.status(404).json({ success: false, message: 'Property request not found' });
    }

    const reportNumber = `GPC-${Date.now()}`;

    const report = new VerificationReport({
      propertyRequest: propertyRequestId,
      reportNumber,
      verifier: req.admin._id,
      findings,
      govRecords,
      expertComments,
      recommendation: recommendation || 'Caution Advised',
      status: 'Draft'
    });

    await report.save();

    // Link report to property request
    await PropertyRequest.findByIdAndUpdate(propertyRequestId, { verificationReport: report._id });

    res.status(201).json({ success: true, message: 'Verification report created', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await VerificationReport.find()
      .populate({ path: 'propertyRequest', populate: { path: 'user', select: 'name email phone' } })
      .populate('verifier', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single report
exports.getReport = async (req, res) => {
  try {
    const report = await VerificationReport.findById(req.params.id)
      .populate({ path: 'propertyRequest', populate: { path: 'user', select: 'name email phone address' } })
      .populate('verifier', 'username');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update report
exports.updateReport = async (req, res) => {
  try {
    const report = await VerificationReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, message: 'Report updated successfully', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Finalize report + generate PDF
exports.finalizeReport = async (req, res) => {
  try {
    const report = await VerificationReport.findById(req.params.id)
      .populate({ path: 'propertyRequest', populate: { path: 'user', select: 'name email phone' } });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Generate PDF
    const pdfResult = await reportService.generateVerificationReport(report.propertyRequest);

    report.reportPdfPath = pdfResult.success ? pdfResult.filepath : null;
    report.status = 'Finalized';
    await report.save();

    // Update property request status to Completed
    await PropertyRequest.findByIdAndUpdate(report.propertyRequest._id, { status: 'Completed' });

    res.json({ success: true, message: 'Report finalized and PDF generated', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Send report to customer via email
exports.sendReportToCustomer = async (req, res) => {
  try {
    const report = await VerificationReport.findById(req.params.id)
      .populate({ path: 'propertyRequest', populate: { path: 'user', select: 'name email phone' } });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (report.status === 'Draft') {
      return res.status(400).json({ success: false, message: 'Please finalize the report before sending' });
    }

    const user = report.propertyRequest.user;
    if (!user.email) {
      return res.status(400).json({ success: false, message: 'Customer email not available' });
    }

    await emailService.sendReportToCustomer(user.email, {
      name: user.name,
      reportNumber: report.reportNumber,
      propertyAddress: report.propertyRequest.propertyAddress,
      recommendation: report.recommendation,
      reportPdfPath: report.reportPdfPath
    });

    report.status = 'Sent to Customer';
    await report.save();

    res.json({ success: true, message: 'Report sent to customer successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const report = await VerificationReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
