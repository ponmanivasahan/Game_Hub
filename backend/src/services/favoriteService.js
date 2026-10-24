const favoriteRepository = require('../repositories/favoriteRepository');
const gameRepository = require('../repositories/gameRepository');

async function isFavorite(userId, gameId) {
  return favoriteRepository.isFavorite(userId, gameId);
}

async function addFavorite(userId, gameId) {
  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new Error('Game not found.');
  }
  await favoriteRepository.addFavorite(userId, gameId);
  return { isFavorite: true };
}

async function removeFavorite(userId, gameId) {
  await favoriteRepository.removeFavorite(userId, gameId);
  return { isFavorite: false };
}

async function toggleFavorite(userId, gameId) {
  const favorited = await favoriteRepository.isFavorite(userId, gameId);
  if (favorited) {
    await favoriteRepository.removeFavorite(userId, gameId);
    return { isFavorite: false };
  } else {
    await favoriteRepository.addFavorite(userId, gameId);
    return { isFavorite: true };
  }
}

async function getUserFavorites(userId, options) {
  return favoriteRepository.getUserFavorites(userId, options);
}

module.exports = {
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  getUserFavorites
};
