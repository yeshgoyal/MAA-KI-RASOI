const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: String, required: true }, // "userId1_userId2" sorted
  content: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'quickReply', 'image'], default: 'text' },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
}, { timestamps: true });

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
