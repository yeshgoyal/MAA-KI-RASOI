const verifyEmailTemplate = (name, otp) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #FFF8F0; color: #1A1208; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e5e4e7; box-shadow: 0 4px 6px -2px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    h1 { color: #E85D26; font-size: 28px; margin: 0; }
    p { font-size: 16px; line-height: 1.6; color: #4A4540; }
    .otp-box { display: inline-block; background-color: #f4f4f5; padding: 20px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E85D26; border: 2px dashed #e4e4e7; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #9A9590; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MaaKeHaathKaKhana 🍲</h1>
    </div>
    <p>Namaste ${name},</p>
    <p>Welcome to our family! We're thrilled to have you here. Please use the following 6-digit verification code to activate your account. This code will expire in 10 minutes.</p>
    <div style="text-align: center;">
      <div class="otp-box">${otp}</div>
    </div>
    <p>If you didn't create an account with us, you can safely ignore this email.</p>
    <p>With love,<br>The MaaKeHaathKaKhana Team</p>
  </div>
</body>
</html>
`;

const orderConfirmationBuyerTemplate = (name, order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #FFF8F0; color: #1A1208; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e5e4e7; box-shadow: 0 4px 6px -2px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    h1 { color: #E85D26; font-size: 28px; margin: 0; }
    p { font-size: 16px; line-height: 1.6; color: #4A4540; }
    .order-box { background: #fdfaf6; border: 1px solid #f2eadc; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .item { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #e2dac9; padding-bottom: 10px; }
    .total { display: flex; justify-content: space-between; font-weight: 600; font-size: 18px; margin-top: 15px; color: #2D6A4F; }
    .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #9A9590; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed! 🍲</h1>
    </div>
    <p>Namaste ${name},</p>
    <p>Your order has been successfully placed. Your home-cooked meal will be prepared with love very soon.</p>
    
    <div class="order-box">
      <h3 style="margin-top:0;">Order Summary</h3>
      ${order.items.map(item => `
        <div class="item">
          <span>${item.qty}x ${item.name}</span>
          <span>₹${item.price * item.qty}</span>
        </div>
      `).join('')}
      <div class="item" style="border:none;">
        <span>Delivery Fee</span>
        <span>₹${order.deliveryFee}</span>
      </div>
      <div class="total">
        <span>Total Amount</span>
        <span>₹${order.finalAmount}</span>
      </div>
      <p style="margin-top: 15px; font-size: 14px;"><strong>Payment:</strong> ${order.paymentMethod}</p>
      <p style="font-size: 14px; margin-top: 5px;"><strong>Status:</strong> ${order.status}</p>
    </div>
    
    <p>You can track the status of your order in your dashboard.</p>
    <p>Enjoy your meal!<br>The MaaKeHaathKaKhana Team</p>
  </div>
</body>
</html>
`;

const orderAlertCookTemplate = (cookName, orderId) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background-color: #FFF8F0; color: #1A1208; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 12px; border: 1px solid #e5e4e7; box-shadow: 0 4px 6px -2px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 30px; }
    h1 { color: #E85D26; font-size: 28px; margin: 0; }
    p { font-size: 16px; line-height: 1.6; color: #4A4540; }
    .btn { display: inline-block; background-color: #FFB703; color: #1A1208; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Order Alert! 🔔</h1>
    </div>
    <p>Hello ${cookName},</p>
    <p>You just received a new order for your delicious food!</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    
    <div style="text-align: center;">
      <a href="${process.env.FRONTEND_URL}/seller/orders" class="btn">View & Accept Order</a>
    </div>
    
    <p>Please check your seller dashboard ASAP to confirm and start preparing.</p>
    <p>Best,<br>The MaaKeHaathKaKhana Team</p>
  </div>
</body>
</html>
`;

module.exports = {
  verifyEmailTemplate,
  orderConfirmationBuyerTemplate,
  orderAlertCookTemplate
};
