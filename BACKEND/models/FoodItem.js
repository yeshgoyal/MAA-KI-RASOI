const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
  type: { type: String, enum: ['veg', 'non-veg', 'egg'], required: true },
  mealType: [{ type: String, enum: ['Breakfast','Lunch','Dinner','Tiffin'] }],
  cookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cook', required: true },
  category: { type: String, default: '' }, // e.g., "Dal", "Rice", "Roti", "Sabzi"
  ingredients: [String],
  calories: { type: Number },
  isHealthy: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isFestivalSpecial: { type: Boolean, default: false },
  festivalName: { type: String, default: '' },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  preparationTime: { type: Number, default: 30 }, // minutes
  servingSize: { type: String, default: '1 person' },
}, { timestamps: true });

// Text search index
foodItemSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
