import React from 'react';
import { useUser } from '@clerk/react';
import LoginPage from '../pages/LoginPage';

/**
 * Protected Route Component
 * Checks if user is authenticated and authorized before rendering component
 * Only allows: ammancateringpkt@gmail.com
 */
const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const ALLOWED_EMAIL = 'ammancateringpkt@gmail.com';

  if (!isLoaded) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <LoginPage />;
  }

  // Check if user's email is authorized
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  if (userEmail !== ALLOWED_EMAIL) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h2>Access Denied</h2>
          <p>You are not authorized to access this application.</p>
          <p className="small-text">Authorized email: {ALLOWED_EMAIL}</p>
          <p className="small-text">Your email: {userEmail}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
