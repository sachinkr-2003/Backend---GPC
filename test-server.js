const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000
  });
});

// Test API routes
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'All APIs working!',
    endpoints: [
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/login',
      'GET /api/properties',
      'POST /api/properties'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});