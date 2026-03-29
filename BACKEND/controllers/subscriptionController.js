const Subscription = require('../models/Subscription');

// @desc Create subscription
// @route POST /api/subscriptions
const createSubscription = async (req, res) => {
  try {
    const { cookId, plan, mealType, preferences, startDate, deliveryAddress, autoRenew } = req.body;
    const planPrices = { Weekly: 700, Monthly: 2500, Custom: 0 };
    const endDate = new Date(startDate);
    if (plan === 'Weekly') endDate.setDate(endDate.getDate() + 7);
    else if (plan === 'Monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setDate(endDate.getDate() + (req.body.customDays || 7));

    const subscription = await Subscription.create({
      userId: req.user._id, cookId, plan, mealType,
      preferences, startDate, endDate, autoRenew: autoRenew || false,
      totalAmount: planPrices[plan] || 0, deliveryAddress,
    });
    res.status(201).json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my subscriptions
// @route GET /api/subscriptions/my
const getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user._id })
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name avatar' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, subscriptions: subs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update subscription (pause/cancel)
// @route PUT /api/subscriptions/:id
const updateSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ _id: req.params.id, userId: req.user._id });
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found' });
    const updated = await Subscription.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json({ success: true, subscription: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createSubscription, getMySubscriptions, updateSubscription };
