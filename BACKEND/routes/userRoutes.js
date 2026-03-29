const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, getWallet, verifyEmail, resendVerification } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/wallet', protect, getWallet);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', protect, resendVerification);

module.exports = router;
