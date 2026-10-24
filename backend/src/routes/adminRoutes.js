const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(requireAuth, requireRole('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/games/:id/feature', adminController.featureGame);
router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);
router.get('/threads', adminController.getThreads);
router.delete('/threads/:id', adminController.deleteThread);
router.delete('/posts/:id', adminController.deletePost);

module.exports = router;
