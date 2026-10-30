import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const apiConfigured = Boolean(configuredBaseUrl && configuredBaseUrl !== 'local');

const api = axios.create({
  baseURL: apiConfigured ? configuredBaseUrl : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;