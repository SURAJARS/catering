import React from 'react';
import { FiDollarSign, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import '../styles/Dashboard.css';

/**
 * Dashboard Component
 * Shows business metrics and insights
 */
const Dashboard = ({ stats }) => {
  if (!stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard</h2>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <FiDollarSign />
          </div>
          <div className="metric-content">
            <h4>Total Revenue</h4>
            <p className="metric-value">{formatCurrency(stats.totalRevenue)}</p>
            <span className="metric-label">{stats.totalEvents} events</span>
          </div>
        </div>

        <div className="metric-card advance">
          <div className="metric-icon">
            <FiCheckCircle />
          </div>
          <div className="metric-content">
            <h4>Advance Received</h4>
            <p className="metric-value">{formatCurrency(stats.totalAdvanceReceived)}</p>
            <span className="metric-label">
              {stats.totalRevenue > 0
                ? Math.round((stats.totalAdvanceReceived / stats.totalRevenue) * 100)
                : 0}
              % collected
            </span>
          </div>
        </div>

        <div className="metric-card pending">
          <div className="metric-icon">
            <FiAlertCircle />
          </div>
          <div className="metric-content">
            <h4>Pending Balance</h4>
            <p className="metric-value">{formatCurrency(stats.totalPendingBalance)}</p>
            <span className="metric-label">Due payment</span>
          </div>
        </div>
      </div>

      {/* Events by Type */}
      <div className="dashboard-section">
        <h3>Events by Type</h3>
        <div className="event-type-breakdown">
          {Object.entries(stats.eventsByType).map(([type, count]) => (
            <div key={type} className="type-bar">
              <span className="type-name">{type}</span>
              <div className="type-progress">
                <div
                  className="type-fill"
                  style={{
                    width: `${(count / Math.max(...Object.values(stats.eventsByType))) * 100}%`,
                  }}
                />
              </div>
              <span className="type-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {stats.upcomingEvents && stats.upcomingEvents.length > 0 && (
        <div className="dashboard-section">
          <h3>📅 Upcoming Events (Next 30 Days)</h3>
          <div className="upcoming-list">
            {stats.upcomingEvents.map((event) => (
              <div key={event._id} className="upcoming-item">
                <div className="upcoming-date">
                  {new Date(event.eventDate).toLocaleDateString('en-IN')}
                </div>
                <div className="upcoming-details">
                  <strong>{event.clientName}</strong>
                  <span className="upcoming-type">{event.eventType}</span>
                </div>
                <div className="upcoming-amount">
                  {formatCurrency(event.totalAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Payments */}
      {stats.overduePayments && stats.overduePayments.length > 0 && (
        <div className="dashboard-section alert">
          <h3>⚠️ Pending Payments</h3>
          <div className="pending-list">
            {stats.overduePayments.map((event) => (
              <div key={event._id} className="pending-item">
                <div className="pending-info">
                  <strong>{event.clientName}</strong>
                  <span className="pending-date">
                    {new Date(event.eventDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="pending-amount">
                  {formatCurrency(event.balanceAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
