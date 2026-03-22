import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────
export const signup = (data) => api.post('/auth/signup', data).then(r => r.data);
export const login  = (data) => api.post('/auth/login',  data).then(r => r.data);

// ─── Tools ───────────────────────────────────────────────────────────────────
export const getTools    = (params) => api.get('/tools', { params }).then(r => r.data);
export const getTool     = (id)     => api.get(`/tools/${id}`).then(r => r.data);
export const getFeatured = ()       => api.get('/tools/featured').then(r => r.data);
export const createTool  = (data)   => api.post('/tools', data).then(r => r.data);

// ─── Categories ──────────────────────────────────────────────────────────────
export const getCategories = () => api.get('/categories').then(r => r.data);

// ─── Favorites ───────────────────────────────────────────────────────────────
export const getFavorites   = (userId)         => api.get(`/favorites/${userId}`).then(r => r.data);
export const addFavorite    = (userId, toolId) => api.post('/favorites', { userId, toolId }).then(r => r.data);
export const removeFavorite = (userId, toolId) => api.delete('/favorites', { data: { userId, toolId } }).then(r => r.data);

export default api;
