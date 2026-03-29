const express = require('express');
const router = express.Router();
const { getFoodItems, getFoodById, createFoodItem, updateFoodItem, deleteFoodItem, getFestivalSpecials, getCookFoodItems } = require('../controllers/foodController');
const { protect, cookOnly } = require('../middleware/authMiddleware');

router.get('/', getFoodItems);
router.get('/festival', getFestivalSpecials);
router.get('/cook', protect, cookOnly, getCookFoodItems);
router.get('/:id', getFoodById);
router.post('/', protect, cookOnly, createFoodItem);
router.put('/:id', protect, cookOnly, updateFoodItem);
router.delete('/:id', protect, cookOnly, deleteFoodItem);

module.exports = router;
