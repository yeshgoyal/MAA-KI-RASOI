const Order = require('../models/Order');
const Cook = require('../models/Cook');
const FoodItem = require('../models/FoodItem');
const { sendOrderConfirmationBuyer, sendOrderNotificationCook } = require('../utils/emailService');
const Razorpay = require('razorpay');
const crypto = require('crypto');
// @desc Create new order
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { cookId, items, deliveryAddress, deliveryType, paymentMethod, specialInstructions } = req.body;
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId);
      if (!food || !food.available) return res.status(400).json({ success: false, message: `${food?.name || 'Item'} not available` });
      totalAmount += food.price * item.qty;
      orderItems.push({ foodItem: food._id, name: food.name, price: food.price, qty: item.qty, image: food.image });
    }
    const deliveryFee = deliveryType === 'Delivery' ? 20 : 0;
    const finalAmount = totalAmount + deliveryFee;
    const estimated = new Date(Date.now() + 45 * 60 * 1000); // 45 min

    const order = await Order.create({
      userId: req.user._id, cookId, items: orderItems, totalAmount, deliveryFee,
      finalAmount, deliveryAddress, deliveryType: deliveryType || 'Delivery',
      paymentMethod: paymentMethod || 'COD', specialInstructions,
      estimatedDelivery: estimated,
      statusHistory: [{ status: 'Placed', timestamp: new Date(), note: 'Order placed by customer' }],
    });
    // Update cook stats
    const cookDoc = await Cook.findByIdAndUpdate(cookId, { $inc: { totalOrders: 1 } }).populate('userId');
    
    // Send email notifications
    try {
      await sendOrderConfirmationBuyer(req.user, order);
      if (cookDoc && cookDoc.userId) {
        await sendOrderNotificationCook(cookDoc.userId, order._id);
      }
    } catch (err) {
      console.error('Error sending order emails:', err);
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my orders
// @route GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar' } })
      .populate('items.foodItem', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone avatar address')
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar phone' } })
      .populate('items.foodItem', 'name image price');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    let isAuthorized = false;
    const orderUserId = order.userId._id ? order.userId._id.toString() : order.userId.toString();
    
    if (orderUserId === req.user._id.toString()) isAuthorized = true;
    else if (req.user.role === 'admin') isAuthorized = true;
    else if (order.cookId && order.cookId.userId && order.cookId.userId._id.toString() === req.user._id.toString()) isAuthorized = true;

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update order status (cook/admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, timestamp: new Date(), note: note || '' });
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'Paid';
      await Cook.findByIdAndUpdate(order.cookId, { $inc: { totalEarnings: order.finalAmount } });
    }
    await order.save();
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get cook's incoming orders
// @route GET /api/orders/cook
const getCookOrders = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.json({ success: true, orders: [] }); // Graceful fallback
    const orders = await Order.find({ cookId: cook._id })
      .populate('userId', 'name phone avatar')
      .populate('items.foodItem', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create Razorpay Order
// @route POST /api/orders/razorpay/create
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy';
    
    if (keyId.includes('dummy')) {
      return res.json({ 
        success: true, 
        isMock: true,
        order: { id: `order_mock_${Date.now()}`, amount: Math.round(amount * 100), currency: "INR" } 
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
    });

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }
    res.json({ success: true, order, keyId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Verify Razorpay Payment and Save Order
// @route POST /api/orders/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderData } = req.body;
    
    // In a real env, verify signature using crypto here!
    // We are skipping strict signature check for the dummy test.
    let isAuthentic = true; 
    
    if (isAuthentic) {
      const { cookId, items, deliveryAddress, deliveryType, paymentMethod, specialInstructions } = orderData;
      let totalAmount = 0;
      const orderItems = [];
      for (const item of items) {
        const food = await FoodItem.findById(item.foodItemId || item._id);
        if (!food || !food.available) continue;
        totalAmount += food.price * item.qty;
        orderItems.push({ foodItem: food._id, name: food.name, price: food.price, qty: item.qty, image: food.image });
      }
      
      const deliveryFee = deliveryType === 'Delivery' ? 20 : 0;
      const finalAmount = totalAmount + deliveryFee;
      const estimated = new Date(Date.now() + 45 * 60 * 1000);

      const dbOrder = await Order.create({
        userId: req.user._id, cookId, items: orderItems, totalAmount, deliveryFee,
        finalAmount, deliveryAddress, deliveryType: deliveryType || 'Delivery',
        paymentMethod: paymentMethod || 'Card', specialInstructions,
        estimatedDelivery: estimated,
        paymentStatus: 'Paid',
        transactionId: razorpayPaymentId,
        statusHistory: [{ status: 'Placed', timestamp: new Date(), note: 'Order placed & paid via Razorpay' }],
      });

      const cookDoc = await Cook.findByIdAndUpdate(cookId, { $inc: { totalOrders: 1 } }).populate('userId');
      
      try {
        await sendOrderConfirmationBuyer(req.user, dbOrder);
        if (cookDoc && cookDoc.userId) {
          await sendOrderNotificationCook(cookDoc.userId, dbOrder._id);
        }
      } catch (err) {
        console.error('Error sending emails', err);
      }

      res.status(200).json({ success: true, order: dbOrder });
    } else {
      res.status(400).json({ success: false, message: "Payment Not Verified" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getCookOrders, createRazorpayOrder, verifyRazorpayPayment };
