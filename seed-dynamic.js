require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');

const services = [
    {
        icon: 'fas fa-home',
        title: 'Complete Land Verification',
        description: 'Comprehensive property document verification and legal check from government records.',
        features: ['Document authenticity check', 'Legal status verification', 'Ownership history'],
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        order: 1
    },
    {
        icon: 'fas fa-clipboard-list',
        title: 'Khasra-Khata Verification',
        description: 'Complete information extraction from government records including Khasra, Khata, map, and demarcation details.',
        features: ['Khasra number verification', 'Khata number check', 'Land survey records'],
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        order: 2
    },
    {
        icon: 'fas fa-map-marked-alt',
        title: 'G.D.A Master Plan Check',
        description: 'Land status verification in GDA master plan to ensure the property is in approved development area.',
        features: ['Master plan status', 'Development permissions', 'Future planning details'],
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        order: 3
    },
    {
        icon: 'fas fa-rupee-sign',
        title: 'Circle Rate Information',
        description: 'Current and accurate circle rate information of the area to help you make informed investment decisions.',
        features: ['Current circle rates', 'Rate comparison', 'Market analysis'],
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        order: 4
    }
];

const testimonials = [
    {
        name: "Rajesh Kumar",
        location: "Patna, Bihar",
        text: "Saved me from buying a disputed property. Their verification report was detailed and accurate.",
        image: "https://randomuser.me/api/portraits/men/4.jpg",
        rating: 5
    },
    {
        name: "Priya Singh",
        location: "Muzaffarpur, Bihar",
        text: "Professional service with quick response. Got my property verified in just 24 hours.",
        image: "https://randomuser.me/api/portraits/women/5.jpg",
        rating: 5
    },
    {
        name: "Amit Sharma",
        location: "Gopalganj, Bihar",
        text: "Transparent process and fair pricing. Highly recommend for anyone buying property in Gorakhpur.",
        image: "https://randomuser.me/api/portraits/men/6.jpg",
        rating: 5
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Service.deleteMany({});
        await Service.insertMany(services);
        console.log('Services seeded!');

        await Testimonial.deleteMany({});
        await Testimonial.insertMany(testimonials);
        console.log('Testimonials seeded!');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
