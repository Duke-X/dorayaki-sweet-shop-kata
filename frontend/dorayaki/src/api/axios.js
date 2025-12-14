import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // VITE_API_URL for Prod
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Backend expects this format? Usually yes, middleware checks 'Authorization' header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
