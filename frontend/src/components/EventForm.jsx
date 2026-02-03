import React, { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiPhone, FiMapPin, FiDollarSign, FiAlertCircle, FiCamera } from 'react-icons/fi';
import { panchangamAPI } from '../api';
import { PANCHANGAM_COLORS } from '../config';
import { formatTo12Hour } from '../utils/timeFormatter';
import '../styles/EventForm.css';

/**
 * Event Form Component
 * Create/Edit catering bookings with panchangam suggestions
 */

const EVENT_TYPES = [
  'Birthday',
  'Ear piercing',
  'Puberty ceremony',
  'Engagement',
  'Marriage',
  'Reception',
  'Virundhu',
  'Valaikaapu',
  '60th marriage',
  '70th marriage',
  'Club orders',
  'Shop opening',
  'Brand meeting',
  'School orders',
  'Temple function',
  'Photo ceremony',
  'Others'
];

const EventForm = ({ event, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState(
    event || {
      eventDate: '',
      eventTime: '18:00',
      eventType: 'Marriage',
      clientName: '',
      clientNickname: '',
      phoneNumber: '',
      location: '',
      totalAmount: '',
      advancePaid: '',
      notes: '',
      eventPhotos: [],
    }
  );

  const [suggestions, setSuggestions] = useState(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTime) newErrors.eventTime = 'Event time is required';
    if (!formData.clientName?.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.phoneNumber?.trim() || formData.phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Valid 10-digit phone number required';
    }
    if (!formData.location?.trim()) newErrors.location = 'Location is required';
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      newErrors.totalAmount = 'Valid amount required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchSuggestions = async () => {
    if (!formData.eventDate || !formData.eventType) return;

    setLoadingSuggestions(true);
    try {
      const response = await panchangamAPI.getSuggestions(formData.eventDate, formData.eventType);
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions({ error: 'Could not fetch panchangam data' });
    } finally {
      setLoadingSuggestions(false);
    }
  };

  React.useEffect(() => {
    if (formData.eventDate && formData.eventType) {
      fetchSuggestions();
    }
  }, [formData.eventDate, formData.eventType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Only send first photo as eventPhotoUrl if photos exist
      const dataToSend = { ...formData };
      if (formData.eventPhotos && formData.eventPhotos.length > 0) {
        // Only send first photo and limit size to ~500KB
        const firstPhoto = formData.eventPhotos[0];
        if (firstPhoto.length < 500000) { // ~500KB limit
          dataToSend.eventPhotoUrl = firstPhoto;
        }
      }
      // Clear eventPhotos array before sending
      delete dataToSend.eventPhotos;
      onSave(dataToSend);
    }
  };

  const balanceAmount = formData.totalAmount && formData.advancePaid 
    ? Math.max(0, parseFloat(formData.totalAmount) - parseFloat(formData.advancePaid || 0))
    : 0;

  return (
    <div className="event-form-overlay">
      <div className="event-form-container">
        <div className="form-header">
          <h2>{event ? '✏️ Edit Event' : '➕ New Event'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-row">
            <div className="form-group full">
              <label>
                <FiCalendar className="icon" />
                Event Date
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className={errors.eventDate ? 'error' : ''}
              />
              {errors.eventDate && <span className="error-text">{errors.eventDate}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiClock className="icon" />
                Event Time
              </label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                className={errors.eventTime ? 'error' : ''}
              />
              {formData.eventTime && (
                <small className="time-display">Selected: {formatTo12Hour(formData.eventTime)}</small>
              )}
              {errors.eventTime && <span className="error-text">{errors.eventTime}</span>}
            </div>

            <div className="form-group">
              <label>Event Type</label>
              <select name="eventType" value={formData.eventType} onChange={handleChange}>
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiUser className="icon" />
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Full name"
                className={errors.clientName ? 'error' : ''}
              />
              {errors.clientName && <span className="error-text">{errors.clientName}</span>}
            </div>

            <div className="form-group">
              <label>Nickname (Optional)</label>
              <input
                type="text"
                name="clientNickname"
                value={formData.clientNickname || ''}
                onChange={handleChange}
                placeholder="Nickname for reference"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiPhone className="icon" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit number"
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">
              <label>
                <FiMapPin className="icon" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event venue"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FiDollarSign className="icon" />
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.totalAmount ? 'error' : ''}
              />
              {errors.totalAmount && <span className="error-text">{errors.totalAmount}</span>}
            </div>

            <div className="form-group">
              <label>
                <FiDollarSign className="icon" />
                Advance Paid
              </label>
              <input
                type="number"
                name="advancePaid"
                value={formData.advancePaid}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {balanceAmount > 0 && (
            <div className="balance-display">
              <span>Balance Amount: </span>
              <strong>₹{balanceAmount.toFixed(2)}</strong>
            </div>
          )}

          <div className="form-row">
            <div className="form-group full">              <label>📸 Event Photos (Optional)</label>
              <div className="photo-upload-section">
                <input
                  type="file"
                  id="photoInput"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    // In production, upload to server and get URLs
                    // For now, store as base64
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData((prev) => ({
                          ...prev,
                          eventPhotos: [...(prev.eventPhotos || []), event.target.result],
                        }));
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="photo-btn"
                  onClick={() => document.getElementById('photoInput').click()}
                >
                  <FiCamera /> Upload from Gallery / Camera
                </button>
                {(formData.eventPhotos && formData.eventPhotos.length > 0) || formData.eventPhotoUrl ? (
                  <div className="photo-preview">
                    {formData.eventPhotoUrl && (
                      <div className="stored-photo-preview">
                        <p>📸 Stored Photo:</p>
                        <img src={formData.eventPhotoUrl} alt="Event" className="photo-thumbnail" />
                      </div>
                    )}
                    {formData.eventPhotos && formData.eventPhotos.length > 0 && (
                      <p className="new-photos-note">{formData.eventPhotos.length} new photo(s) selected</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full">              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional details..."
                rows="3"
              />
            </div>
          </div>

          {/* Panchangam Suggestions */}
          {suggestions && (
            <div className="panchangam-suggestions">
              <h3>📅 Panchangam Suggestions</h3>
              {suggestions.error ? (
                <p className="suggestion-text muted">⚠ {suggestions.error}</p>
              ) : (
                <>
                  {suggestions.isAuspicious && (
                    <div
                      className="suggestion-box"
                      style={{ borderLeft: `4px solid ${PANCHANGAM_COLORS.AUSPICIOUS}` }}
                    >
                      ✅ {suggestions.message}
                    </div>
                  )}

                  {suggestions.warnings && suggestions.warnings.length > 0 && (
                    <div className="warnings">
                      {suggestions.warnings.map((warning, idx) => (
                        <div
                          key={idx}
                          className="suggestion-box warning"
                          style={{ borderLeft: `4px solid ${PANCHANGAM_COLORS.INAUSPICIOUS}` }}
                        >
                          <FiAlertCircle className="inline-icon" />
                          <strong>{warning.type}:</strong> {warning.startTime} - {warning.endTime}
                          <p className="warning-message">{warning.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {suggestions.auspiciousTimes && suggestions.auspiciousTimes.length > 0 && (
                    <div className="auspicious-times">
                      <strong>✨ Good times for this event:</strong>
                      {suggestions.auspiciousTimes.map((time, idx) => (
                        <div key={idx} className="time-slot">
                          {time.startTime} - {time.endTime}
                        </div>
                      ))}
                    </div>
                  )}

                  {suggestions.festival && (
                    <p className="suggestion-text">
                      <strong>Festival:</strong> {suggestions.festival}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {loadingSuggestions && <p className="loading">Loading panchangam data...</p>}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
