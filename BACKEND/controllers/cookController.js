const Cook = require('../models/Cook');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc Register as cook
// @route POST /api/cooks/register
const registerCook = async (req, res) => {
  try {
    const existing = await Cook.findOne({ userId: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Cook profile already exists' });
    const cook = await Cook.create({ userId: req.user._id, ...req.body });
    // Update user role
    await User.findByIdAndUpdate(req.user._id, { role: 'cook' });
    res.status(201).json({ success: true, cook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all approved cooks (with filters)
// @route GET /api/cooks
const getCooks = async (req, res) => {
  try {
    const { city, mealType, rating, page = 1, limit = 12 } = req.query;
    const filter = { isApproved: true, isActive: true };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (mealType) filter.availableFor = mealType;
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    const cooks = await Cook.find(filter)
      .populate('userId', 'name avatar')
      .sort({ rating: -1, totalOrders: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Cook.countDocuments(filter);
    res.json({ success: true, cooks, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get cook by ID
// @route GET /api/cooks/:id
const getCookById = async (req, res) => {
  try {
    const cook = await Cook.findById(req.params.id)
      .populate('userId', 'name avatar email phone')
      .populate({ path: 'weeklyMenu.items', model: 'FoodItem' });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook not found' });

    const reviews = await Review.find({ cookId: cook._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, cook, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update cook profile
// @route PUT /api/cooks/:id
const updateCook = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
    
    if (req.body.phone !== undefined) {
      await User.findByIdAndUpdate(req.user._id, { phone: req.body.phone });
    }

    const updated = await Cook.findByIdAndUpdate(cook._id, req.body, { returnDocument: 'after' });
    res.json({ success: true, cook: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my cook profile
// @route GET /api/cooks/me
const getMyCook = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id }).populate('userId', 'name avatar phone email');
    if (!cook) return res.status(404).json({ success: false, message: 'No cook profile found' });
    res.json({ success: true, cook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerCook, getCooks, getCookById, updateCook, getMyCook };
