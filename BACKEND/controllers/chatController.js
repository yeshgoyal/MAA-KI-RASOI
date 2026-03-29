const Message = require('../models/Message');
const User = require('../models/User');

const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

// @desc Get conversation messages
// @route GET /api/chat/:userId
const getMessages = async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    // Mark as read
    await Message.updateMany({ conversationId, receiver: req.user._id, read: false }, { read: true, readAt: new Date() });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Send a message
// @route POST /api/chat/send
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, type } = req.body;
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: 'Receiver not found' });
    const conversationId = getConversationId(req.user._id.toString(), receiverId);
    const message = await Message.create({
      sender: req.user._id, receiver: receiverId, conversationId, content, type: type || 'text',
    });
    await message.populate('sender', 'name avatar');
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get my conversations list
// @route GET /api/chat/conversations
const getConversations = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort({ createdAt: -1 });

    const seenConversations = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId = msg.sender.toString() === myId ? msg.receiver.toString() : msg.sender.toString();
      if (!seenConversations.has(otherId)) {
        seenConversations.add(otherId);
        const other = await User.findById(otherId).select('name avatar role');
        const unread = await Message.countDocuments({ conversationId: msg.conversationId, receiver: req.user._id, read: false });
        conversations.push({ user: other, lastMessage: msg.content, lastTime: msg.createdAt, unread });
      }
    }
    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
