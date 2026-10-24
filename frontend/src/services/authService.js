import { api } from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/auth/profile', data);
    return res.data;
  },

  async getUserProfile(username) {
    const res = await api.get(`/users/${username}`);
    return res.data;
  },

  async getNotifications() {
    const res = await api.get('/users/notifications');
    return res.data;
  },

  async markNotificationRead(id) {
    return api.put(`/users/notifications/${id}/read`);
  },

  async markAllNotificationsRead() {
    return api.put('/users/notifications/read-all');
  }
};
