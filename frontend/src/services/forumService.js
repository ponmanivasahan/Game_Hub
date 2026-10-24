import { api } from './api';

export const forumService = {
  async getThreads(gameId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/games/${gameId}/threads?${query}`);
    return res.data;
  },

  async getRecentThreads(limit = 8) {
    const res = await api.get(`/forum/recent?limit=${limit}`);
    return res.data;
  },

  async getThread(id) {
    const res = await api.get(`/forum/threads/${id}`);
    return res.data;
  },

  async createThread(gameId, data) {
    const res = await api.post(`/games/${gameId}/threads`, data);
    return res.data;
  },

  async lockThread(id, isLocked) {
    const res = await api.put(`/forum/threads/${id}/lock`, { is_locked: isLocked });
    return res.data;
  },

  async deleteThread(id) {
    return api.delete(`/forum/threads/${id}`);
  },

  async getPosts(threadId, params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/forum/threads/${threadId}/posts?${query}`);
    return res.data;
  },

  async createPost(threadId, content) {
    const res = await api.post(`/forum/threads/${threadId}/posts`, { content });
    return res.data;
  },

  async updatePost(id, content) {
    const res = await api.put(`/forum/posts/${id}`, { content });
    return res.data;
  },

  async deletePost(id) {
    return api.delete(`/forum/posts/${id}`);
  }
};
