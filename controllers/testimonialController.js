const Testimonial = require('../models/Testimonial');

// Get all testimonials (Public - Only active)
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort('-createdAt');
        res.json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Get all testimonials (Admin - All)
exports.adminGetTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort('-createdAt');
        res.json({ success: true, count: testimonials.length, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json({ success: true, message: 'Testimonial created', data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Update testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
        res.json({ success: true, message: 'Testimonial updated', data: testimonial });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// Delete testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
        res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
