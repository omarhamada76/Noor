import axios from 'axios';
import { getApiBaseUrl } from './config';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('noor_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('noor_token');
      localStorage.removeItem('noor_user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
