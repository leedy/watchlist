import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (email, password, name) => api.post('/auth/register', { email, password, name });
export const getMe = () => api.get('/auth/me');

// Watchlist
export const getWatchlist = (params) => api.get('/watchlist', { params });
export const addToWatchlist = (item) => api.post('/watchlist', item);
export const updateWatchlistItem = (id, updates) => api.patch(`/watchlist/${id}`, updates);
export const deleteWatchlistItem = (id) => api.delete(`/watchlist/${id}`);
export const getRandomPick = () => api.get('/watchlist/random');

// Family
export const createFamily = (name) => api.post('/family', { name });
export const getFamily = () => api.get('/family');
export const joinFamily = (inviteCode) => api.post('/family/join', { inviteCode });
export const leaveFamily = () => api.post('/family/leave');
export const getFamilyWatchlist = () => api.get('/family/watchlist');

// TMDB
export const searchTMDB = (query, type) => api.get('/tmdb/search', { params: { query, type } });
export const getSettings = () => api.get('/tmdb/settings');

export default api;
