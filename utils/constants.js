// Service pricing
exports.SERVICE_PRICING = {
  'Basic': 3000,
  'Complete': 5000,
  'Premium': 8000
};

// Property types
exports.PROPERTY_TYPES = [
  'Residential',
  'Commercial', 
  'Agricultural'
];

// Service types
exports.SERVICE_TYPES = [
  'Basic',
  'Complete',
  'Premium'
];

// Request statuses
exports.REQUEST_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled'
];

// Payment statuses
exports.PAYMENT_STATUSES = [
  'Pending',
  'Paid',
  'Failed'
];

// Admin roles
exports.ADMIN_ROLES = [
  'Admin',
  'Super Admin',
  'Manager'
];

// File upload constants
exports.ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Email templates
exports.EMAIL_TEMPLATES = {
  REQUEST_CONFIRMATION: 'request_confirmation',
  ADMIN_NOTIFICATION: 'admin_notification',
  STATUS_UPDATE: 'status_update',
  PAYMENT_CONFIRMATION: 'payment_confirmation'
};