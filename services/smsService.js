// SMS Service for Gorakhpur Property Check using MSG91
const fetch = require('node-fetch');

exports.sendSMS = async (phone, message) => {
  try {
    if (!process.env.SMS_API_KEY) {
      console.log(`📱 SMS would be sent to ${phone}: ${message}`);
      return { success: true, message: 'SMS sent successfully (demo mode)' };
    }

    const response = await fetch('https://api.msg91.com/api/sendhttp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        authkey: process.env.SMS_API_KEY,
        mobiles: phone,
        message: message,
        sender: process.env.SMS_SENDER_ID || 'GPCPROP',
        route: '4',
        country: '91'
      })
    });

    const result = await response.text();
    console.log('✅ SMS sent successfully:', result);
    
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('❌ SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send request confirmation SMS
exports.sendRequestConfirmationSMS = async (phone, requestData) => {
  const message = `Dear ${requestData.name}, your property verification request #${requestData._id} has been received. Amount: ₹${requestData.amount}. We will contact you within 24 hours. - Gorakhpur Property Check`;
  
  return await this.sendSMS(phone, message);
};

// Send status update SMS
exports.sendStatusUpdateSMS = async (phone, requestData) => {
  const message = `Your property verification request #${requestData._id} status has been updated to: ${requestData.status}. - Gorakhpur Property Check`;
  
  return await this.sendSMS(phone, message);
};