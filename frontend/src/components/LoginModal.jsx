import React, { useState } from 'react';
import '../styles/LoginModal.css';

const LoginModal = ({ onLogin, allowedEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      const result = onLogin(email);
      if (!result.success) {
        setError(result.error);
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
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-login">
            {loading ? 'Verifying...' : 'Access App'}
          </button>

          <div className="login-info">
            <small>Authorized email: {allowedEmail}</small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
