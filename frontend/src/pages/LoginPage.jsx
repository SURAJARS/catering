import React from 'react';
import { SignIn } from '@clerk/react';
import '../styles/LoginPage.css';

/**
 * Login Page Component
 * Displays Clerk sign-in form
 */
const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>🍽️ Catering Management</h1>
          <p>Secure Access Only</p>
        </div>
        <SignIn />
      </div>
    </div>
  );
};

export default LoginPage;
