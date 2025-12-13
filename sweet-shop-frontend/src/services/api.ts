import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // You can transform response data here if needed
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not on login/register page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden - insufficient permissions
        toast.error('You do not have permission to perform this action.');
      } else if (status === 404) {
        // Not found
        toast.error('Resource not found.');
      } else if (status === 409) {
        // Conflict - duplicate resource
        toast.error(data.message || 'Resource already exists.');
      } else if (status === 422) {
        // Validation error
        const errors = data.errors || [];
        errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (status >= 500) {
        // Server error
        toast.error('Server error. Please try again later.');
      } else {
        // Other errors
        toast.error(data.message || 'An error occurred.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      toast.error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      toast.error('Request failed. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check if user is online
export const isOnline = () => {
  return navigator.onLine;
};

// Helper function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
    return response.data.success === true;
  } catch {
    return false;
  }
};

export default api;