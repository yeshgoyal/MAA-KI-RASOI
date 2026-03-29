const express = require('express');
const router = express.Router();
const { createReview, getCookReviews, replyToReview } = require('../controllers/reviewController');
const { protect, cookOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/cook/:cookId', getCookReviews);
router.put('/:id/reply', protect, cookOnly, replyToReview);

module.exports = router;
