const reviewService = require('../services/reviewService');

async function getGameReviews(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const result = await reviewService.getGameReviews(gameId, req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function createReview(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const review = await reviewService.createReview(req.user, gameId, req.body);
    res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      data: review
    });
  } catch (error) {
    next(error);
  }
}

async function updateReview(req, res, next) {
  try {
    const reviewId = req.params.id;
    const updated = await reviewService.updateReview(reviewId, req.user, req.body);
    res.json({
      success: true,
      message: 'Review updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    const reviewId = req.params.id;
    await reviewService.deleteReview(reviewId, req.user);
    res.json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentReviews(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
    const reviews = await reviewService.getRecentReviews(limit);
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGameReviews,
  createReview,
  updateReview,
  deleteReview,
  getRecentReviews
};
