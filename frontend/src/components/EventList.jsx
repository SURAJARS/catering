import React from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import '../styles/EventList.css';

/**
 * Event List Component
 * Display events in tabular format with actions
 */
const EventList = ({ events, onEdit, onDelete, loading }) => {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>📋 No events scheduled. Create your first booking!</p>
      </div>
    );
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h3>📅 Upcoming Events</h3>
        <span className="event-count">{events.length} booking(s)</span>
      </div>

      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-card-header">
              <div>
                <h4>{event.clientName}</h4>
                <p className="event-type">{event.eventType}</p>
              </div>
              <div className="event-date">
                {new Date(event.eventDate).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div className="event-card-body">
              <div className="event-details-row">
                <span className="label">Time:</span>
                <span className="value">{event.eventTime}</span>
              </div>
              <div className="event-details-row">
                <span className="label">Location:</span>
                <span className="value">{event.location}</span>
              </div>
              <div className="event-details-row">
                <span className="label">Phone:</span>
                <span className="value">{event.phoneNumber}</span>
              </div>

              <div className="payment-info">
                <div className="payment-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹{event.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="payment-row">
                  <span className="label">Advance:</span>
                  <span className="value">₹{event.advancePaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="payment-row">
                  <span className="label">Balance:</span>
                  <span className={`value ${event.balanceAmount > 0 ? 'pending' : 'paid'}`}>
                    ₹{event.balanceAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {event.notes && <p className="event-notes">{event.notes}</p>}
            </div>

            <div className="event-card-footer">
              <button
                className="btn-icon edit"
                onClick={() => onEdit(event)}
                disabled={loading}
                title="Edit event"
              >
                <FiEdit2 /> Edit
              </button>
              <button
                className="btn-icon delete"
                onClick={() => onDelete(event._id)}
                disabled={loading}
                title="Cancel event"
              >
                <FiTrash2 /> Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
