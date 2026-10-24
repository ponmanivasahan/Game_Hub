const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/recent', forumController.getRecentThreads);
router.get('/threads/:id', forumController.getThread);
router.put('/threads/:id/lock', requireAuth, requireRole('admin'), forumController.lockThread);
router.delete('/threads/:id', requireAuth, forumController.deleteThread);

router.get('/threads/:id/posts', forumController.getPosts);
router.post('/threads/:id/posts', requireAuth, forumController.createPost);
router.put('/posts/:id', requireAuth, forumController.updatePost);
router.delete('/posts/:id', requireAuth, forumController.deletePost);

module.exports = router;
