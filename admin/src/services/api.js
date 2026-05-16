import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

// Attach token from localStorage on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
