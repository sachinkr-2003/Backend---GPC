const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, default: 5 },
    image: { type: String, default: 'https://randomuser.me/api/portraits/men/1.jpg' },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema, 'testimonials');
