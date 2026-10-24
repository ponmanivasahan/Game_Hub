import { api } from './api';

export const adminService = {
  async getStats(params = {}) {
    const query = new URLSearchParams();
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    const res = await api.get(`/admin/stats?${query.toString()}`);
    return res.data;
  },

  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/admin/users?${query}`);
    return res.data;
  },

  async toggleUserStatus(id, isActive) {
    const res = await api.put(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  async toggleFeatureGame(id, isFeatured) {
    const res = await api.put(`/admin/games/${id}/feature`, { isFeatured });
    return res.data;
  },

  async getReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/admin/reviews?${query}`);
    return res.data;
  },

  async deleteReview(id) {
    return api.delete(`/admin/reviews/${id}`);
  },

  async getThreads(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/admin/threads?${query}`);
    return res.data;
  },

  async deleteThread(id) {
    return api.delete(`/admin/threads/${id}`);
  },

  async deletePost(id) {
    return api.delete(`/admin/posts/${id}`);
  }
};
