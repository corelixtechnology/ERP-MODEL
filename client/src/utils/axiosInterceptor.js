import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Crucial for receiving and sending HTTP-Only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

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
