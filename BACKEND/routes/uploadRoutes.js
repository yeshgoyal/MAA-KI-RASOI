const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// @desc Upload a single image
// @route POST /api/upload
// @access Private
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    res.status(200).json({
      success: true,
      url: req.file.path,
      message: 'Image uploaded securely to Cloudinary'
    });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

module.exports = router;
