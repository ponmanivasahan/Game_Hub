import { api } from './api';

export const reviewService = {
  async getGameReviews(gameId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/games/${gameId}/reviews?${query}`);
    return res.data;
  },

  async createReview(gameId, data) {
    const res = await api.post(`/games/${gameId}/reviews`, data);
    return res.data;
  },

  async updateReview(id, data) {
    const res = await api.put(`/reviews/${id}`, data);
    return res.data;
  },

  async deleteReview(id) {
    return api.delete(`/reviews/${id}`);
  },

  async getRecentReviews(limit = 6) {
    const res = await api.get(`/reviews/recent?limit=${limit}`);
    return res.data;
  }
};
