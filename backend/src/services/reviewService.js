const reviewRepository = require('../repositories/reviewRepository');
const gameRepository = require('../repositories/gameRepository');

async function getGameReviews(gameId, options) {
  const reviews = await reviewRepository.findByGameId(gameId, options);
  const distribution = await reviewRepository.getRatingDistribution(gameId);
  return {
    ...reviews,
    distribution: distribution.distribution
  };
}

async function createReview(user, gameId, { rating, reviewText }) {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5.');
  }
  if (!reviewText || !reviewText.trim()) {
    throw new Error('Review content cannot be empty.');
  }

  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new Error('Game not found.');
  }

  const existingReview = await reviewRepository.findByGameAndUser(gameId, user.id);
  if (existingReview) {
    throw new Error('You have already submitted a review for this game. You can edit your existing review instead.');
  }

  return reviewRepository.createReview({
    gameId,
    userId: user.id,
    rating: parseInt(rating, 10),
    reviewText: reviewText.trim()
  });
}

async function updateReview(reviewId, user, { rating, reviewText }) {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5.');
  }
  if (!reviewText || !reviewText.trim()) {
    throw new Error('Review content cannot be empty.');
  }

  const existing = await reviewRepository.findById(reviewId);
  if (!existing) {
    throw new Error('Review not found.');
  }

  if (existing.user_id !== user.id && user.role !== 'admin') {
    throw new Error('You do not have permission to edit this review.');
  }

  return reviewRepository.updateReview(reviewId, user.id, {
    rating: parseInt(rating, 10),
    reviewText: reviewText.trim()
  });
}

async function deleteReview(reviewId, user) {
  const existing = await reviewRepository.findById(reviewId);
  if (!existing) {
    throw new Error('Review not found.');
  }

  const isAdmin = user.role === 'admin';
  if (existing.user_id !== user.id && !isAdmin) {
    throw new Error('You do not have permission to delete this review.');
  }

  return reviewRepository.deleteReview(reviewId, user.id, isAdmin);
}

async function getRecentReviews(limit = 6) {
  return reviewRepository.getRecentReviews(limit);
}

module.exports = {
  getGameReviews,
  createReview,
  updateReview,
  deleteReview,
  getRecentReviews
};
