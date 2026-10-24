const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const reviewController = require('../controllers/reviewController');
const forumController = require('../controllers/forumController');
const favoriteController = require('../controllers/favoriteController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', gameController.getGames);
router.get('/trending', gameController.getTrending);
router.get('/upcoming', gameController.getUpcoming);
router.get('/featured', gameController.getFeatured);
router.get('/metadata', gameController.getMetadata);

router.post('/fetch-steam', requireAuth, requireRole('developer', 'admin'), gameController.fetchSteam);
router.post('/', requireAuth, requireRole('developer', 'admin'), gameController.createGame);

router.get('/omni/search', gameController.omniSearch);
router.get('/:slug/similar', gameController.getSimilarGames);
router.get('/:slug/telemetry', gameController.getGameTelemetry);

router.get('/id/:id', optionalAuth, gameController.getGameById);
router.get('/:slug', optionalAuth, gameController.getGameBySlug);
router.put('/:id', requireAuth, requireRole('developer', 'admin'), gameController.updateGame);
router.delete('/:id', requireAuth, requireRole('developer', 'admin'), gameController.deleteGame);

router.get('/:gameId/reviews', reviewController.getGameReviews);
router.post('/:gameId/reviews', requireAuth, reviewController.createReview);

router.get('/:gameId/threads', forumController.getThreads);
router.post('/:gameId/threads', requireAuth, forumController.createThread);

router.post('/:id/favorite', requireAuth, favoriteController.toggleFavorite);
router.delete('/:id/favorite', requireAuth, favoriteController.toggleFavorite);

module.exports = router;
