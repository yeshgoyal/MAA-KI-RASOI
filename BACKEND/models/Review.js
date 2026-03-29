const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  text: { type: String, required: true, trim: true },
  images: [String],
  verified: { type: Boolean, default: false }, // Only users who ordered can review
  helpful: { type: Number, default: 0 },
  reply: { type: String, default: '' }, // Cook's reply
  repliedAt: { type: Date },
}, { timestamps: true });

// Prevent duplicate reviews per order
reviewSchema.index({ userId: 1, orderId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
