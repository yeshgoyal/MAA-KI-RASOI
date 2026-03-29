const FoodItem = require('../models/FoodItem');
const Cook = require('../models/Cook');

// @desc Get all food items with filters
// @route GET /api/food
const getFoodItems = async (req, res) => {
  try {
    const { type, mealType, minPrice, maxPrice, rating, search, cookId, isHealthy, page = 1, limit = 20 } = req.query;
    const filter = { available: true };
    if (type) filter.type = type;
    if (mealType) filter.mealType = mealType;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (cookId) filter.cookId = cookId;
    if (isHealthy === 'true') filter.isHealthy = true;
    if (search) filter.$text = { $search: search };

    const items = await FoodItem.find(filter)
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar' } })
      .sort({ isBestSeller: -1, rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await FoodItem.countDocuments(filter);
    res.json({ success: true, items, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get food item by ID
// @route GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id)
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar phone' } });
    if (!item) return res.status(404).json({ success: false, message: 'Food item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create food item (cook only)
// @route POST /api/food
const createFoodItem = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
    const item = await FoodItem.create({ ...req.body, cookId: cook._id });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get food items by current cook
// @route GET /api/food/cook
const getCookFoodItems = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.json({ success: true, foodItems: [] });
    const foodItems = await FoodItem.find({ cookId: cook._id }).sort({ createdAt: -1 });
    res.json({ success: true, foodItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update food item
// @route PUT /api/food/:id
const updateFoodItem = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
    const item = await FoodItem.findOne({ _id: req.params.id, cookId: cook._id });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found or not yours' });
    const updated = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json({ success: true, item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete food item
// @route DELETE /api/food/:id
const deleteFoodItem = async (req, res) => {
  try {
    const cook = await Cook.findOne({ userId: req.user._id });
    if (!cook) return res.status(404).json({ success: false, message: 'Cook profile not found' });
    const item = await FoodItem.findOne({ _id: req.params.id, cookId: cook._id });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found or not yours' });
    await item.deleteOne();
    res.json({ success: true, message: 'Food item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get festival specials
// @route GET /api/food/festival
const getFestivalSpecials = async (req, res) => {
  try {
    const items = await FoodItem.find({ isFestivalSpecial: true, available: true })
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar' } })
      .limit(10);
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getFoodItems, getFoodById, createFoodItem, updateFoodItem, deleteFoodItem, getFestivalSpecials, getCookFoodItems };
