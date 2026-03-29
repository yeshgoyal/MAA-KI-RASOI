const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'professional', 'cook', 'admin'], default: 'student' },
  phone: { type: String, trim: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  avatar: { type: String, default: '' },
  wallet: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  emailVerificationOtp: String,
  emailVerificationOtpExpire: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate referral code
userSchema.pre('save', function () {
  if (!this.referralCode) {
    this.referralCode = 'MAA' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
});

module.exports = mongoose.model('User', userSchema);
