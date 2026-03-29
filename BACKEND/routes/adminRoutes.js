const express = require('express');
const router = express.Router();
const { getStats, getPendingCooks, approveCook, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/cooks/pending', getPendingCooks);
router.put('/cooks/:id/approve', approveCook);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
