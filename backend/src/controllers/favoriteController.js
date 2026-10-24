const favoriteService = require('../services/favoriteService');

async function toggleFavorite(req, res, next) {
  try {
    const gameId = req.params.id;
    const result = await favoriteService.toggleFavorite(req.user.id, gameId);
    res.json({
      success: true,
      message: result.isFavorite ? 'Added to favorites.' : 'Removed from favorites.',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getMyFavorites(req, res, next) {
  try {
    const result = await favoriteService.getUserFavorites(req.user.id, req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  toggleFavorite,
  getMyFavorites
};
