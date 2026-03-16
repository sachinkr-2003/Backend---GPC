const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send property request confirmation email
exports.sendRequestConfirmation = async (userEmail, requestData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: 'Property Verification Request Received - Gorakhpur Property Check',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Property Verification Request Received</h2>
          <p>Dear ${requestData.name},</p>
          <p>Thank you for choosing Gorakhpur Property Check. We have received your property verification request.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Request Details:</h3>
            <p><strong>Request ID:</strong> #${requestData._id}</p>
            <p><strong>Property Address:</strong> ${requestData.propertyAddress}</p>
            <p><strong>Service Type:</strong> ${requestData.serviceType}</p>
            <p><strong>Amount:</strong> ₹${requestData.amount}</p>
            <p><strong>Status:</strong> ${requestData.status}</p>
          </div>
          
          <p>Our team will contact you within 24 hours to proceed with the verification process.</p>
          
          <div style="margin-top: 30px;">
            <p>Best regards,<br>
            <strong>Arun Singh</strong><br>
            Gorakhpur Property Check<br>
            Phone: +91 9693420595</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent successfully');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

// Send status update email to customer
exports.sendStatusUpdate = async (userEmail, requestData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: `Property Request Status Updated - #${requestData._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Request Status Updated</h2>
          <p>Dear ${requestData.name},</p>
          <p>Your property verification request status has been updated.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Request ID:</strong> #${requestData._id}</p>
            <p><strong>Property:</strong> ${requestData.propertyAddress}</p>
            <p><strong>Service:</strong> ${requestData.serviceType}</p>
            <p><strong>New Status:</strong> <span style="color: #28a745; font-weight: bold;">${requestData.status}</span></p>
          </div>
          <p>For queries, contact: +91 9693420595</p>
          <p>Best regards,<br><strong>Gorakhpur Property Check</strong></p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent');
  } catch (error) {
    console.error('❌ Status update email failed:', error);
  }
};

// Send verification report to customer
exports.sendReportToCustomer = async (userEmail, reportData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: `Property Verification Report Ready - ${reportData.reportNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Your Property Verification Report is Ready</h2>
          <p>Dear ${reportData.name},</p>
          <p>Your property verification report has been completed.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Report Number:</strong> ${reportData.reportNumber}</p>
            <p><strong>Property:</strong> ${reportData.propertyAddress}</p>
            <p><strong>Recommendation:</strong> <span style="color: #28a745; font-weight: bold;">${reportData.recommendation}</span></p>
          </div>
          <p>Please find the detailed report attached or contact us for more information.</p>
          <p>Best regards,<br><strong>Gorakhpur Property Check</strong><br>Phone: +91 9693420595</p>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('✅ Report email sent to customer');
  } catch (error) {
    console.error('❌ Report email failed:', error);
  }
};

// Send admin notification
exports.sendAdminNotification = async (requestData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'New Property Verification Request - Admin Alert',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">New Property Verification Request</h2>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Request Details:</h3>
            <p><strong>Request ID:</strong> #${requestData._id}</p>
            <p><strong>Customer:</strong> ${requestData.user.name}</p>
            <p><strong>Phone:</strong> ${requestData.user.phone}</p>
            <p><strong>Email:</strong> ${requestData.user.email}</p>
            <p><strong>Property:</strong> ${requestData.propertyAddress}</p>
            <p><strong>Service:</strong> ${requestData.serviceType}</p>
            <p><strong>Amount:</strong> ₹${requestData.amount}</p>
          </div>
          
          <p>Please login to admin panel to assign and process this request.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent successfully');
  } catch (error) {
    console.error('❌ Admin notification failed:', error);
  }
};