const express = require('express');
const router = express.Router();
const { registerCook, getCooks, getCookById, updateCook, getMyCook } = require('../controllers/cookController');
const { protect, cookOnly } = require('../middleware/authMiddleware');

router.post('/register', protect, registerCook);
router.get('/', getCooks);
router.get('/me', protect, getMyCook);
router.get('/:id', getCookById);
router.put('/:id', protect, cookOnly, updateCook);

module.exports = router;
