const adminRepository = require('../repositories/adminRepository');
const userRepository = require('../repositories/userRepository');
const gameRepository = require('../repositories/gameRepository');

async function getDashboardStats(options) {
  return adminRepository.getStats(options);
}

async function getUsers(options) {
  return userRepository.findAll(options);
}

async function toggleUserStatus(userId, isActive) {
  return userRepository.toggleActiveStatus(userId, isActive);
}

async function toggleFeatureGame(gameId, isFeatured, adminUserId) {
  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new Error('Game not found.');
  }
  await gameRepository.setFeatured(gameId, isFeatured, adminUserId);
  return gameRepository.findById(gameId);
}

async function getAllReviews(options) {
  return adminRepository.getAllReviews(options);
}

async function getAllThreads(options) {
  return adminRepository.getAllThreads(options);
}

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  toggleFeatureGame,
  getAllReviews,
  getAllThreads
};
