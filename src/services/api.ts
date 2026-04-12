// services/api.ts
import axios from 'axios';

// Backend API base URL - AWS hosted
const API_BASE_URL = 'http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com/api/orders';

// Demo mode: Set to true to use mock data without authentication
const DEMO_MODE = true;

// If you have a real token, set it here or in localStorage
const DEMO_TOKEN = localStorage.getItem('authToken') || 'demo-token-for-testing';

console.log('API Base URL:', API_BASE_URL);
console.log('Demo Mode:', DEMO_MODE ? '✅ Enabled (no auth required)' : '❌ Disabled');
console.log('Using token:', DEMO_TOKEN);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Always add the demo token for testing
    const token = localStorage.getItem('authToken') || DEMO_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Authentication required. Please login.');
      console.error('Error details:', error.response?.data);
      // You can redirect to login page here if needed
    } else if (error.response?.status === 403) {
      console.error('Forbidden: Insufficient permissions');
      console.error('Error details:', error.response?.data);
    } else if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
