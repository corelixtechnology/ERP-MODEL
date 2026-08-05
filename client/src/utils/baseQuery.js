import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

let rawBaseUrl = import.meta.env.VITE_API_URL;

// If VITE_API_URL is missing in production on Render, dynamically fall back to live Render backend
if (!rawBaseUrl && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  rawBaseUrl = 'https://erp-model-kipa.onrender.com/api/v1';
}

if (!rawBaseUrl) {
  rawBaseUrl = 'http://localhost:5000/api/v1';
}

if (rawBaseUrl && !rawBaseUrl.includes('/api/v1')) {
  rawBaseUrl = `${rawBaseUrl.replace(/\/$/, '')}/api/v1`;
}

export const dynamicBaseQuery = fetchBaseQuery({
  baseUrl: rawBaseUrl,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
