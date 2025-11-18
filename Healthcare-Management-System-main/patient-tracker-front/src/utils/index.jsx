import axios from 'axios';

// Use Vite environment variable when provided, otherwise default to local backend
const apiBase = (import.meta && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5001/api';

export const customFetch = axios.create({
  baseURL: apiBase,
});

export const customFetchNoToken = axios.create({
  baseURL: apiBase,
});

// Request interceptor to add the auth token to every request (safe access)
customFetch.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')) || null;
      const token = user?.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore JSON parse errors and continue without token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);