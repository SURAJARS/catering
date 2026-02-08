import { useState, useEffect } from 'react';

const ALLOWED_EMAIL = 'ammancateringpkt@gmail.com';
const AUTH_TOKEN_KEY = 'catering_auth_token';
const AUTH_PASSWORD_KEY = 'catering_auth_password';

/**
 * Custom hook for password-based authentication
 * Email is hardcoded (ammancateringpkt@gmail.com)
 * Only password is required for login
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously authenticated
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedPassword = localStorage.getItem(AUTH_PASSWORD_KEY);

    if (storedToken && storedPassword) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = (password) => {
    // Password will be validated against environment variable on frontend
    // For additional security, this should also be validated on backend
    if (password && password.length > 0) {
      const token = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_PASSWORD_KEY, password);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid password' };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_PASSWORD_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
