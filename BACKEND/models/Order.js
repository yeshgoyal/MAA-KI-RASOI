const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  items: [{
    foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
    name: String,
    price: Number,
    qty: { type: Number, required: true, min: 1 },
    image: String,
  }],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Placed', 'Accepted', 'Assigned to Partner', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  deliveryType: { type: String, enum: ['Delivery', 'Pickup'], default: 'Delivery' },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'Wallet', 'COD'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  transactionId: { type: String },
  estimatedDelivery: { type: Date },
  deliveredAt: { type: Date },
  specialInstructions: { type: String, default: '' },
  isRated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
