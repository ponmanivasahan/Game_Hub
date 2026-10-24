const gameRepository = require('../repositories/gameRepository');
const metadataRepository = require('../repositories/metadataRepository');
const { fetchGameDataFromSteam } = require('./steamApi');

async function getGames(query) {
  return gameRepository.findAll(query);
}

async function getGameBySlug(slug) {
  const game = await gameRepository.findBySlug(slug);
  if (!game) {
    throw new Error('Game not found.');
  }
  return game;
}

async function getGameById(id) {
  const game = await gameRepository.findById(id);
  if (!game) {
    throw new Error('Game not found.');
  }
  return game;
}

async function getTrendingGames(limit = 6) {
  return gameRepository.findTrending(limit);
}

async function getUpcomingGames(limit = 8) {
  return gameRepository.findUpcoming(limit);
}

async function getFeaturedGames(limit = 6) {
  return gameRepository.findFeatured(limit);
}

async function createGame(user, gameData) {
  if (!gameData.title || !gameData.title.trim()) {
    throw new Error('Game title is required.');
  }

  let genreIds = gameData.genre_ids || [];
  if (Array.isArray(gameData.genre_names)) {
    for (const name of gameData.genre_names) {
      const g = await metadataRepository.getOrCreateGenre(name);
      if (!genreIds.includes(g.id)) genreIds.push(g.id);
    }
  }

  let tagIds = gameData.tag_ids || [];
  if (Array.isArray(gameData.tag_names)) {
    for (const name of gameData.tag_names) {
      const t = await metadataRepository.getOrCreateTag(name);
      if (!tagIds.includes(t.id)) tagIds.push(t.id);
    }
  }

  let platformIds = gameData.platform_ids || [];
  if (Array.isArray(gameData.platform_names)) {
    for (const name of gameData.platform_names) {
      const p = await metadataRepository.getOrCreatePlatform(name);
      if (!platformIds.includes(p.id)) platformIds.push(p.id);
    }
  }

  const payload = {
    ...gameData,
    developer_id: user.id,
    genre_ids: genreIds,
    tag_ids: tagIds,
    platform_ids: platformIds,
    is_featured: user.role === 'admin' ? !!gameData.is_featured : false
  };

  const newGameId = await gameRepository.createGame(payload);
  return gameRepository.findById(newGameId);
}

async function updateGame(id, user, gameData) {
  const existing = await gameRepository.findById(id);
  if (!existing) {
    throw new Error('Game not found.');
  }

  if (existing.developer_id !== user.id && user.role !== 'admin') {
    throw new Error('You do not have permission to modify this game.');
  }

  let genreIds = gameData.genre_ids;
  if (Array.isArray(gameData.genre_names)) {
    genreIds = [];
    for (const name of gameData.genre_names) {
      const g = await metadataRepository.getOrCreateGenre(name);
      genreIds.push(g.id);
    }
  }

  let platformIds = gameData.platform_ids;
  if (Array.isArray(gameData.platform_names)) {
    platformIds = [];
    for (const name of gameData.platform_names) {
      const p = await metadataRepository.getOrCreatePlatform(name);
      platformIds.push(p.id);
    }
  }

  await gameRepository.updateGame(id, {
    ...gameData,
    genre_ids: genreIds,
    platform_ids: platformIds
  });

  return gameRepository.findById(id);
}

async function deleteGame(id, user) {
  const existing = await gameRepository.findById(id);
  if (!existing) {
    throw new Error('Game not found.');
  }

  if (existing.developer_id !== user.id && user.role !== 'admin') {
    throw new Error('You do not have permission to delete this game.');
  }

  return gameRepository.deleteGame(id);
}

async function fetchSteamData(appId) {
  return fetchGameDataFromSteam(appId);
}

async function getSimilarGames(slug, limit = 4) {
  const game = await getGameBySlug(slug);
  return gameRepository.findSimilarGames(game.id, limit);
}

async function getGameTelemetry(slug) {
  const game = await getGameBySlug(slug);
  return gameRepository.getGameTelemetry(game.id);
}

async function omniSearch(keyword, limit = 8) {
  if (!keyword || !keyword.trim()) {
    return { games: [], tags: [], genres: [] };
  }
  return gameRepository.omniSearch(keyword, limit);
}

module.exports = {
  getGames,
  getGameBySlug,
  getGameById,
  getTrendingGames,
  getUpcomingGames,
  getFeaturedGames,
  createGame,
  updateGame,
  deleteGame,
  fetchSteamData,
  getSimilarGames,
  getGameTelemetry,
  omniSearch
};
