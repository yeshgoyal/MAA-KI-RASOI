const nodemailer = require('nodemailer');
const { verifyEmailTemplate, orderConfirmationBuyerTemplate, orderAlertCookTemplate } = require('./emailTemplates');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"MaaKeHaathKaKhana" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };
    
    // Fallback if env vars aren't set
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'put_your_gmail_here@gmail.com') {
      console.log('--- MOCK EMAIL SENT ---');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('-------------------------');
      return true;
    }

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const sendVerificationEmail = async (user, otp) => {
  const html = verifyEmailTemplate(user.name, otp);
  return sendEmail({
    email: user.email,
    subject: 'Welcome! Please verify your email',
    html
  });
};

const sendOrderConfirmationBuyer = async (user, order) => {
  const html = orderConfirmationBuyerTemplate(user.name, order);
  return sendEmail({
    email: user.email,
    subject: 'Order Confirmed - MaaKeHaathKaKhana',
    html
  });
};

const sendOrderNotificationCook = async (cookUser, orderId) => {
  const html = orderAlertCookTemplate(cookUser.name, orderId);
  return sendEmail({
    email: cookUser.email,
    subject: 'New Order Received!',
    html
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendOrderConfirmationBuyer,
  sendOrderNotificationCook
};
