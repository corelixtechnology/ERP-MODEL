import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
if (rawBaseUrl && !rawBaseUrl.includes('/api/v1')) {
  rawBaseUrl = `${rawBaseUrl.replace(/\/$/, '')}/api/v1`;
}

const api = axios.create({
  baseURL: rawBaseUrl,
  withCredentials: true, // Crucial for receiving and sending HTTP-Only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch 401 errors (unauthorized) and redirect or handle logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, we can trigger state cleanup if needed
      console.warn('Session expired or unauthorized request.');
    }
    return Promise.reject(error);
  }
);

export default api;
