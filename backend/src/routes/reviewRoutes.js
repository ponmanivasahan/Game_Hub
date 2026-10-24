const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/recent', reviewController.getRecentReviews);
router.put('/:id', requireAuth, reviewController.updateReview);
router.delete('/:id', requireAuth, reviewController.deleteReview);

module.exports = router;
