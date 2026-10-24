const gameService = require('../services/gameService');
const metadataRepository = require('../repositories/metadataRepository');
const favoriteRepository = require('../repositories/favoriteRepository');

async function getGames(req, res, next) {
  try {
    const result = await gameService.getGames(req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getGameBySlug(req, res, next) {
  try {
    const game = await gameService.getGameBySlug(req.params.slug);
    let isFavorite = false;
    if (req.user) {
      isFavorite = await favoriteRepository.isFavorite(req.user.id, game.id);
    }
    res.json({
      success: true,
      data: {
        ...game,
        is_favorite: isFavorite
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getGameById(req, res, next) {
  try {
    const game = await gameService.getGameById(req.params.id);
    res.json({
      success: true,
      data: game
    });
  } catch (error) {
    next(error);
  }
}

async function getTrending(req, res, next) {
  try {
    const games = await gameService.getTrendingGames(req.query.limit ? parseInt(req.query.limit, 10) : 6);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    next(error);
  }
}

async function getUpcoming(req, res, next) {
  try {
    const games = await gameService.getUpcomingGames(req.query.limit ? parseInt(req.query.limit, 10) : 8);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    next(error);
  }
}

async function getFeatured(req, res, next) {
  try {
    const games = await gameService.getFeaturedGames(req.query.limit ? parseInt(req.query.limit, 10) : 6);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    next(error);
  }
}

async function createGame(req, res, next) {
  try {
    const game = await gameService.createGame(req.user, req.body);
    res.status(201).json({
      success: true,
      message: 'Game published successfully.',
      data: game
    });
  } catch (error) {
    next(error);
  }
}

async function updateGame(req, res, next) {
  try {
    const game = await gameService.updateGame(req.params.id, req.user, req.body);
    res.json({
      success: true,
      message: 'Game updated successfully.',
      data: game
    });
  } catch (error) {
    next(error);
  }
}

async function deleteGame(req, res, next) {
  try {
    await gameService.deleteGame(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Game removed successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function fetchSteam(req, res, next) {
  try {
    const { appId } = req.body;
    const data = await gameService.fetchSteamData(appId);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function getMetadata(req, res, next) {
  try {
    const [genres, tags, platforms] = await Promise.all([
      metadataRepository.getGenres(),
      metadataRepository.getTags(),
      metadataRepository.getPlatforms()
    ]);
    res.json({
      success: true,
      data: { genres, tags, platforms }
    });
  } catch (error) {
    next(error);
  }
}

async function getSimilarGames(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 4;
    const games = await gameService.getSimilarGames(req.params.slug, limit);
    res.json({
      success: true,
      data: games
    });
  } catch (error) {
    next(error);
  }
}

async function getGameTelemetry(req, res, next) {
  try {
    const telemetry = await gameService.getGameTelemetry(req.params.slug);
    res.json({
      success: true,
      data: telemetry
    });
  } catch (error) {
    next(error);
  }
}

async function omniSearch(req, res, next) {
  try {
    const q = req.query.q || '';
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const results = await gameService.omniSearch(q, limit);
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGames,
  getGameBySlug,
  getGameById,
  getTrending,
  getUpcoming,
  getFeatured,
  createGame,
  updateGame,
  deleteGame,
  fetchSteam,
  getMetadata,
  getSimilarGames,
  getGameTelemetry,
  omniSearch
};
