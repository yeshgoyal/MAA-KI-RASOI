const User = require('../models/User');
const Cook = require('../models/Cook');
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// @desc Get platform stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalCooks, totalOrders, pendingCooks] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Cook.countDocuments({ isApproved: true }),
      Order.countDocuments(),
      Cook.countDocuments({ isApproved: false }),
    ]);
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate({ path: 'cookId', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, stats: { totalUsers, totalCooks, totalOrders, pendingCooks, totalRevenue }, recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get pending cook registrations
// @route GET /api/admin/cooks/pending
const getPendingCooks = async (req, res) => {
  try {
    const cooks = await Cook.find({ isApproved: false })
      .populate('userId', 'name email phone avatar createdAt');
    res.json({ success: true, cooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Approve or reject cook
// @route PUT /api/admin/cooks/:id/approve
const approveCook = async (req, res) => {
  try {
    const { approve, hygieneBadge, trustedMaaBadge } = req.body;
    const cook = await Cook.findByIdAndUpdate(req.params.id, {
      isApproved: approve,
      isActive: approve,
      hygieneBadge: hygieneBadge || false,
      trustedMaaBadge: trustedMaaBadge || false,
    }, { returnDocument: 'after' });
    if (!approve) await User.findByIdAndUpdate(cook.userId, { role: 'student' });
    res.json({ success: true, cook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Toggle user active status
// @route PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getPendingCooks, approveCook, getAllUsers, toggleUserStatus };
