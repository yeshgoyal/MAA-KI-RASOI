const mongoose = require('mongoose');

const cookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String, default: '' },
  photo: { type: String, default: '' },
  kitchenPhoto: { type: String, default: '' },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  specialDishes: [String],
  weeklyMenu: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' }],
  }],
  hygieneBadge: { type: Boolean, default: false },
  trustedMaaBadge: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  yearsOfExperience: { type: Number, default: 0 },
  cookingStyle: [String],
  availableFor: [{ type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Tiffin'] }],
  deliveryRadius: { type: Number, default: 5 }, // km
  minOrderAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cook', cookSchema);
