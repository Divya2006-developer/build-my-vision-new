const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/:projectId', authenticateToken, messageController.getMessages);
router.post('/:projectId', authenticateToken, messageController.sendMessage);

module.exports = router;
