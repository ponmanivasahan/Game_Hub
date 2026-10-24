const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/:channel', chatController.getMessages);
router.post('/:channel', requireAuth, chatController.sendMessage);

module.exports = router;
