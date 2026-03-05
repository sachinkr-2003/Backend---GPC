const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const User = require('./models/User');
const PropertyRequest = require('./models/PropertyRequest');

// Load environment variables
require('dotenv').config();

// Database initialization script
const initializeDatabase = async () => {
  try {
    const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/GPC';
    // Connect to MongoDB
    await mongoose.connect(dbUrl);
    console.log(`✅ Connected to MongoDB - ${dbUrl.includes('localhost') ? 'Local GPC' : 'Remote'} Database`);

    // Clear existing data (optional)
    // await Admin.deleteMany({});
    // await User.deleteMany({});
    // await PropertyRequest.deleteMany({});

    // Create default admin user
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new Admin({
        username: 'admin',
        password: 'admin123', // Will be hashed automatically
        role: 'Super Admin',
        status: 'Active'
      });
      await admin.save();
      console.log('✅ Default admin user created');
    }

    // Create sample users
    const users = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '9876543210',
        address: 'Patna, Bihar',
        status: 'Active'
      },
      {
        name: 'Priya Singh',
        email: 'priya@email.com',
        phone: '9876543211',
        address: 'Muzaffarpur, Bihar',
        status: 'Active'
      }
    ];

    for (const userData of users) {
      const userExists = await User.findOne({ phone: userData.phone });
      if (!userExists) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ User ${userData.name} created`);
      }
    }

    // Create sample property requests
    const user1 = await User.findOne({ phone: '9876543210' });
    const user2 = await User.findOne({ phone: '9876543211' });

    if (user1 && user2) {
      const requests = [
        {
          user: user1._id,
          propertyAddress: 'Plot No. 123, Civil Lines, Gorakhpur, UP',
          propertyType: 'Residential',
          serviceType: 'Complete',
          status: 'Pending',
          amount: 5000,
          paymentStatus: 'Pending',
          notes: 'Property verification for residential plot'
        },
        {
          user: user2._id,
          propertyAddress: 'Shop No. 45, Bank Road, Gorakhpur, UP',
          propertyType: 'Commercial',
          serviceType: 'Basic',
          status: 'In Progress',
          amount: 3000,
          paymentStatus: 'Paid',
          notes: 'Commercial property verification'
        }
      ];

      for (const requestData of requests) {
        const requestExists = await PropertyRequest.findOne({
          propertyAddress: requestData.propertyAddress
        });
        if (!requestExists) {
          const request = new PropertyRequest(requestData);
          await request.save();
          console.log(`✅ Property request created for ${requestData.propertyAddress}`);
        }
      }
    }

    console.log('🎉 Database initialization completed!');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();