import { api } from './api';

export const chatService = {
  async getMessages(channel = 'general', limit = 50) {
    const res = await api.get(`/chat/${channel}?limit=${limit}`);
    return res.data;
  },

  async sendMessage(channel = 'general', message) {
    const res = await api.post(`/chat/${channel}`, { message });
    return res.data;
  }
};
