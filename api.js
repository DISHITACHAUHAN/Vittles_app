// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your Render URL here
const BASE_URL = 'https://foodapp-3-kmi1.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
