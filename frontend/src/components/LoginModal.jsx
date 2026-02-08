import React, { useState } from 'react';
import '../styles/LoginModal.css';

const LoginModal = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get password from environment variable
  const correctPassword = import.meta.env.VITE_APP_PASSWORD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      if (password === correctPassword) {
        const result = onLogin(password);
        if (result.success) {
          // Success - App will re-render automatically
        } else {
          setError(result.error);
        }
      } else {
        setError('Invalid password. Access denied.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <div className="login-header">
          <h1>🍽️ Catering Management</h1>
          <p>Secure Access Only</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
