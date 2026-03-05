const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: { type: String, default: 'Gorakhpur Property Check' },
    contactEmail: { type: String, default: 'info@gorakhpurpropertycheck.com' },
    contactPhone: { type: String, default: '+91 9693420595' },
    whatsappNumber: { type: String, default: '919693420595' },
    pricing: {
        basic: { type: Number, default: 3000 },
        complete: { type: Number, default: 5000 },
        premium: { type: Number, default: 8000 }
    },
    address: { type: String, default: 'Gorakhpur, Uttar Pradesh' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema, 'settings');
