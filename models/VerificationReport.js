const mongoose = require('mongoose');

const verificationReportSchema = new mongoose.Schema({
    propertyRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PropertyRequest',
        required: true
    },
    reportNumber: {
        type: String,
        required: true,
        unique: true
    },
    verifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    findings: {
        titleDeedMatch: { type: Boolean, default: false },
        taxReceiptMatch: { type: Boolean, default: false },
        mortgageFree: { type: Boolean, default: false },
        legalDisputeFree: { type: Boolean, default: false },
        possessionVerified: { type: Boolean, default: false }
    },
    govRecords: {
        khasraNumber: String,
        khataNumber: String,
        villageName: String,
        tehsil: String,
        district: { type: String, default: 'Gorakhpur' }
    },
    expertComments: String,
    recommendation: {
        type: String,
        enum: ['Safe to Purchase', 'Caution Advised', 'High Risk / Dispute', 'Consult Legal Expert'],
        default: 'Caution Advised'
    },
    reportPdfPath: String,
    status: {
        type: String,
        enum: ['Draft', 'Finalized', 'Sent to Customer'],
        default: 'Draft'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VerificationReport', verificationReportSchema, 'verification_reports');
