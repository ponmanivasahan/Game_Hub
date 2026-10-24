const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/authMiddleware');
const { pool } = require('../config/database');

router.get('/notifications', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
});

router.put('/notifications/:id/read', requireAuth, async (req, res, next) => {
  try {
    await pool.execute(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (error) {
    next(error);
  }
});

router.put('/notifications/read-all', requireAuth, async (req, res, next) => {
  try {
    await pool.execute(
      `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ?`,
      [req.user.id]
    );
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
});

router.get('/:username', userController.getUserProfile);

module.exports = router;
