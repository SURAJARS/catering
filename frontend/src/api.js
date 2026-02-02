import axios from 'axios';
import { API_BASE_URL } from './config.js';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Events API
 */
export const eventsAPI = {
  getAll: (startDate, endDate, eventType) =>
    apiClient.get('/events', { params: { startDate, endDate, eventType } }),
  getById: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
  getDashboardStats: (startDate, endDate) =>
    apiClient.get('/events/stats/dashboard', { params: { startDate, endDate } }),
};

/**
 * Panchangam API
 */
export const panchangamAPI = {
  getRange: (startDate, endDate) =>
    apiClient.get('/panchangam/range', { params: { startDate, endDate } }),
  getForDate: (date) => apiClient.get(`/panchangam/date/${date}`),
  getAuspiciousDays: (startDate, endDate) =>
    apiClient.get('/panchangam/auspicious-days', { params: { startDate, endDate } }),
  getSuggestions: (eventDate, eventType) =>
    apiClient.get(`/panchangam/suggestions/${eventDate}/${eventType}`),
};

/**
 * Settings API
 */
export const settingsAPI = {
  get: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/settings', data),
  testEmail: (email) => apiClient.post('/settings/test-email', { email }),
};

export default apiClient;
