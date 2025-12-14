import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will handle this to localhost:5000
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
