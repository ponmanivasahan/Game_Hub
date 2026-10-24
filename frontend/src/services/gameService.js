import { api } from './api';

export const gameService = {
  async getGames(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await api.get(`/games?${query.toString()}`);
    return res.data;
  },

  async getGameBySlug(slug) {
    const res = await api.get(`/games/${slug}`);
    return res.data;
  },

  async getGameById(id) {
    const res = await api.get(`/games/id/${id}`);
    return res.data;
  },

  async getTrending(limit = 6) {
    const res = await api.get(`/games/trending?limit=${limit}`);
    return res.data;
  },

  async getUpcoming(limit = 8) {
    const res = await api.get(`/games/upcoming?limit=${limit}`);
    return res.data;
  },

  async getFeatured(limit = 6) {
    const res = await api.get(`/games/featured?limit=${limit}`);
    return res.data;
  },

  async getMetadata() {
    const res = await api.get('/games/metadata');
    return res.data;
  },

  async fetchSteam(appId) {
    const res = await api.post('/games/fetch-steam', { appId });
    return res.data;
  },

  async createGame(gameData) {
    const res = await api.post('/games', gameData);
    return res.data;
  },

  async updateGame(id, gameData) {
    const res = await api.put(`/games/${id}`, gameData);
    return res.data;
  },

  async deleteGame(id) {
    return api.delete(`/games/${id}`);
  },

  async getSimilar(slug, limit = 4) {
    const res = await api.get(`/games/${slug}/similar?limit=${limit}`);
    return res.data;
  },

  async getTelemetry(slug) {
    const res = await api.get(`/games/${slug}/telemetry`);
    return res.data;
  },

  async omniSearch(q, limit = 8) {
    const res = await api.get(`/games/omni/search?q=${encodeURIComponent(q)}&limit=${limit}`);
    return res.data;
  }
};
