import { useState, useEffect } from 'react';

const ALLOWED_EMAIL = 'ammancateringpkt@gmail.com';
const AUTH_TOKEN_KEY = 'catering_auth_token';
const AUTH_EMAIL_KEY = 'catering_auth_email';

/**
 * Custom hook for email-based authentication
 * Stores email in localStorage after verification
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously authenticated
    const storedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (storedEmail === ALLOWED_EMAIL && storedToken) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }

    setLoading(false);
  }, []);

  const login = (email) => {
    if (email === ALLOWED_EMAIL) {
      const token = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(AUTH_EMAIL_KEY, email);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      setIsAuthenticated(true);
      setUserEmail(email);
      return { success: true };
    }
    return { success: false, error: `Access denied. Only ${ALLOWED_EMAIL} can access.` };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return {
    isAuthenticated,
    userEmail,
    loading,
    login,
    logout,
    allowedEmail: ALLOWED_EMAIL,
  };
};
