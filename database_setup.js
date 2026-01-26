// MongoDB Database Setup Script for Gorakhpur Property Check
// Run this in MongoDB Compass or MongoDB Shell

// Use the database
use gorakhpur_property_check

// Create Admin User
db.admins.insertOne({
  username: "admin",
  password: "$2b$12$LQv3c1yqBwEHFww4FqQwu.rWuFNXK6ej8ok3isHrFH2S2HYzfHqK6", // hashed "admin123"
  role: "Super Admin",
  status: "Active",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample users
db.users.insertMany([
  {
    name: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "9876543210",
    address: "Patna, Bihar",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Priya Singh", 
    email: "priya@email.com",
    phone: "9876543211",
    address: "Muzaffarpur, Bihar",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create sample property requests
db.propertyrequests.insertMany([
  {
    user: ObjectId(), // Will be linked to actual user
    propertyAddress: "Plot No. 123, Civil Lines, Gorakhpur, UP",
    propertyType: "Residential",
    serviceType: "Complete",
    status: "Pending",
    amount: 5000,
    paymentStatus: "Pending",
    documents: [],
    notes: "Property verification for residential plot",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    user: ObjectId(), // Will be linked to actual user
    propertyAddress: "Shop No. 45, Bank Road, Gorakhpur, UP",
    propertyType: "Commercial", 
    serviceType: "Basic",
    status: "In Progress",
    amount: 3000,
    paymentStatus: "Paid",
    documents: [],
    notes: "Commercial property verification",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.users.createIndex({ phone: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.admins.createIndex({ username: 1 }, { unique: true });
db.propertyrequests.createIndex({ user: 1 });
db.propertyrequests.createIndex({ status: 1 });
db.propertyrequests.createIndex({ createdAt: -1 });

// Show collections
show collections

// Verify data
db.admins.find().pretty()
db.users.find().pretty()
db.propertyrequests.find().pretty()