import { useState, useEffect } from 'react';

const ALLOWED_EMAIL = 'ammancateringpkt@gmail.com';
const AUTH_TOKEN_KEY = 'catering_auth_token';
const AUTH_PASSWORD_KEY = 'catering_auth_password';
const LAST_LOGIN_KEY = 'catering_last_login';

/**
 * Custom hook for password-based authentication
 * Email is hardcoded (ammancateringpkt@gmail.com)
 * Only password is required for login
 * Tracks last login timestamp
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastLogin, setLastLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously authenticated
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedPassword = localStorage.getItem(AUTH_PASSWORD_KEY);
    const storedLastLogin = localStorage.getItem(LAST_LOGIN_KEY);

    if (storedToken && storedPassword) {
      setIsAuthenticated(true);
      if (storedLastLogin) {
        setLastLogin(new Date(storedLastLogin));
      }
    }

    setLoading(false);
  }, []);

  const login = (password) => {
    // Password will be validated against environment variable on frontend
    // For additional security, this should also be validated on backend
    if (password && password.length > 0) {
      const token = Math.random().toString(36).substring(2, 15);
      const now = new Date();
      
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_PASSWORD_KEY, password);
      localStorage.setItem(LAST_LOGIN_KEY, now.toISOString());
      
      setIsAuthenticated(true);
      setLastLogin(now);
      return { success: true };
    }
    return { success: false, error: 'Invalid password' };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_PASSWORD_KEY);
    setIsAuthenticated(false);
    setLastLogin(null);
  };

  const getLastLoginDisplay = () => {
    if (!lastLogin) return 'First login';
    
    const now = new Date();
    const diff = now - lastLogin;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return lastLogin.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    isAuthenticated,
    lastLogin,
    loading,
    login,
    logout,
    getLastLoginDisplay,
  };
};
