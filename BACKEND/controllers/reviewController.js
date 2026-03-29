const Review = require('../models/Review');
const Cook = require('../models/Cook');
const Order = require('../models/Order');

// @desc Create a review
// @route POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { cookId, orderId, foodItemId, rating, title, text } = req.body;
    // Verify order belongs to user
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, userId: req.user._id, status: 'Delivered' });
      if (!order) return res.status(400).json({ success: false, message: 'Can only review delivered orders' });
    }
    const review = await Review.create({
      userId: req.user._id, cookId, orderId, foodItemId, rating, title, text,
      verified: !!orderId,
    });
    // Update cook average rating
    const allReviews = await Review.find({ cookId });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await Cook.findByIdAndUpdate(cookId, { rating: avgRating.toFixed(1), totalRatings: allReviews.length });
    if (orderId) await Order.findByIdAndUpdate(orderId, { isRated: true });
    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get reviews for a cook
// @route GET /api/reviews/cook/:cookId
const getCookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ cookId: req.params.cookId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Cook replies to a review
// @route PUT /api/reviews/:id/reply
const replyToReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { reply: req.body.reply, repliedAt: new Date() }, { returnDocument: 'after' });
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getCookReviews, replyToReview };
