const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'fas fa-home' },
    features: [{ type: String }],
    gradient: { type: String, default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema, 'services');
