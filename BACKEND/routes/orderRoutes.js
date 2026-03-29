const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, updateOrderStatus, getCookOrders, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/orderController');
const { protect, cookOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/razorpay/create', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.get('/my', protect, getMyOrders);
router.get('/cook', protect, cookOnly, getCookOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
