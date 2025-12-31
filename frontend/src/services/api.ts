import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
};

export const userService = {
  getUsers: (skip = 0, limit = 20, search = '') =>
    api.get('/users', { params: { skip, limit, search } }),
  getUserById: (id: number) =>
    api.get(`/users/${id}`),
};

export const kudosService = {
  createKudos: (recipientId: number, message: string) =>
    api.post('/kudos', { recipient_id: recipientId, message }),
  getKudosFeed: (skip = 0, limit = 20, recipientId?: number) =>
    api.get('/kudos/feed', { params: { skip, limit, recipient_id: recipientId } }),
  getKudosById: (id: number) =>
    api.get(`/kudos/${id}`),
};

export const adminService = {
  getAllKudos: (skip = 0, limit = 20, recipientId?: number) =>
    api.get('/admin/kudos', { params: { skip, limit, recipient_id: recipientId } }),
  hideKudos: (id: number, reason: string) =>
    api.patch(`/admin/kudos/${id}/hide`, { reason }),
  deleteKudos: (id: number, reason: string) =>
    api.delete(`/admin/kudos/${id}`, { data: { reason } }),
  getModerationLogs: (skip = 0, limit = 20) =>
    api.get('/admin/moderation-logs', { params: { skip, limit } }),
};

export default api;
