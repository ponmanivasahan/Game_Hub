import { api } from './api';

export const favoriteService = {
  async toggleFavorite(gameId) {
    const res = await api.post(`/games/${gameId}/favorite`);
    return res.data;
  },

  async getMyFavorites(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/favorites/my?${query}`);
    return res.data;
  }
};
