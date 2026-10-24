const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/my', requireAuth, favoriteController.getMyFavorites);

module.exports = router;
