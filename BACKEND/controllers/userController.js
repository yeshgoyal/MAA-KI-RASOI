const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc Register user
// @route POST /api/users/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'student', phone });
    
    // Automatically initialize Seller profile if Cook role
    if (user.role === 'cook') {
      const Cook = require('../models/Cook'); // Required locally to avoid circular dependencies if any
      await Cook.create({ userId: user._id });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email
    try {
      await sendVerificationEmail(user, otp);
    } catch (err) {
      console.error('Failed to send verification email', err);
    }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wallet: user.wallet, referralCode: user.referralCode, avatar: user.avatar, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Login user
// @route POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wallet: user.wallet, referralCode: user.referralCode, avatar: user.avatar, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get logged in user profile
// @route GET /api/users/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @desc Update user profile
// @route PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get wallet balance
// @route GET /api/users/wallet
const getWallet = async (req, res) => {
  const user = await User.findById(req.user._id).select('wallet referralCode');
  res.json({ success: true, wallet: user.wallet, referralCode: user.referralCode });
};

// @desc Verify email using OTP
// @route POST /api/users/verify-email
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Please provide email and OTP' });

    const user = await User.findOne({
      email,
      emailVerificationOtp: otp,
      emailVerificationOtpExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'OTP is invalid or has expired' });

    user.isVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Resend verification email
// @route POST /api/users/resend-verification
const resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendVerificationEmail(user, otp);
    res.json({ success: true, message: 'Verification email resent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, getWallet, verifyEmail, resendVerification };
