const adminService = require('../services/adminService');
const reviewService = require('../services/reviewService');
const forumService = require('../services/forumService');

async function getStats(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const stats = await adminService.getDashboardStats({ startDate, endDate });
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await adminService.getUsers(req.query);
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

async function toggleUserStatus(req, res, next) {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;
    const updated = await adminService.toggleUserStatus(userId, isActive);
    res.json({
      success: true,
      message: isActive ? 'User activated.' : 'User deactivated.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

async function featureGame(req, res, next) {
  try {
    const gameId = req.params.id;
    const { isFeatured } = req.body;
    const game = await adminService.toggleFeatureGame(gameId, isFeatured, req.user.id);
    res.json({
      success: true,
      message: isFeatured ? 'Game marked as featured.' : 'Game unfeatured.',
      data: game
    });
  } catch (error) {
    next(error);
  }
}

async function getReviews(req, res, next) {
  try {
    const reviews = await adminService.getAllReviews(req.query);
    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
}

async function deleteReview(req, res, next) {
  try {
    await reviewService.deleteReview(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Review moderated and removed.'
    });
  } catch (error) {
    next(error);
  }
}

async function getThreads(req, res, next) {
  try {
    const threads = await adminService.getAllThreads(req.query);
    res.json({
      success: true,
      data: threads
    });
  } catch (error) {
    next(error);
  }
}

async function deleteThread(req, res, next) {
  try {
    await forumService.deleteThread(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Thread removed by administrator.'
    });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    await forumService.deletePost(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Post removed by administrator.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStats,
  getUsers,
  toggleUserStatus,
  featureGame,
  getReviews,
  deleteReview,
  getThreads,
  deleteThread,
  deletePost
};
