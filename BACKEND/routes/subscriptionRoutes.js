const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions, updateSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubscription);
router.get('/my', protect, getMySubscriptions);
router.put('/:id', protect, updateSubscription);

module.exports = router;
