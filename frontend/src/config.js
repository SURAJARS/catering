export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const EVENT_TYPES = ['Marriage', 'Reception', 'Engagement', 'Other'];

export const PANCHANGAM_COLORS = {
  AUSPICIOUS: '#10b981', // Green
  INAUSPICIOUS: '#ef4444', // Red
  NEUTRAL: '#f59e0b', // Yellow
  DEFAULT: '#e5e7eb', // Gray
};

export const DEFAULT_REMINDER_DAYS = [1, 3];
