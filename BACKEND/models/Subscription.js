const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  plan: { type: String, enum: ['Weekly', 'Monthly', 'Custom'], required: true },
  mealType: [{ type: String, enum: ['Breakfast','Lunch','Dinner','Tiffin'] }],
  preferences: {
    dietType: { type: String, enum: ['veg', 'non-veg', 'both'], default: 'veg' },
    lowOil: { type: Boolean, default: false },
    highProtein: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Spicy'], default: 'Medium' },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Paused', 'Expired', 'Cancelled'], default: 'Active' },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
