import React, { useState, useEffect } from 'react';
import { FiMail, FiSave, FiCheck } from 'react-icons/fi';
import { settingsAPI } from '../api';
import '../styles/Settings.css';

/**
 * Settings Component
 * Email configuration and notification preferences
 */
const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingSending, setTestSending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      setSettings(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReminderDaysChange = (e, index) => {
    const newDays = [...(settings.reminderDays || [])];
    newDays[index] = parseInt(e.target.value);
    setSettings((prev) => ({ ...prev, reminderDays: newDays }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsAPI.update(settings);
      setMessage({ type: 'success', text: '✓ Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestSending(true);
      await settingsAPI.testEmail(settings.email);
      setMessage({ type: 'success', text: '✓ Test email sent successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send test email',
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setTestSending(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h2>⚙️ Settings</h2>

      {message && (
        <div className={`message message-${message.type}`}>
          {message.type === 'success' && <FiCheck className="message-icon" />}
          {message.text}
        </div>
      )}

      {settings && (
        <div className="settings-form">
          <div className="settings-section">
            <h3>
              <FiMail /> Email Configuration
            </h3>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="your-email@gmail.com"
              />
              <p className="help-text">Reminder emails will be sent to this address</p>
            </div>

            <button
              className="btn-test-email"
              onClick={handleTestEmail}
              disabled={testingSending || !settings.email}
            >
              {testingSending ? 'Sending...' : '📧 Send Test Email'}
            </button>
          </div>

          <div className="settings-section">
            <h3>🔔 Reminder Configuration</h3>

            <div className="reminder-toggle">
              <label>
                <input
                  type="checkbox"
                  name="notificationsEnabled"
                  checked={settings.notificationsEnabled}
                  onChange={handleChange}
                />
                <span>Enable email reminders</span>
              </label>
            </div>

            {settings.notificationsEnabled && (
              <div className="reminder-days">
                <label>Send reminders before event:</label>
                {settings.reminderDays && settings.reminderDays.map((day, idx) => (
                  <div key={idx} className="reminder-input">
                    <input
                      type="number"
                      value={day}
                      onChange={(e) => handleReminderDaysChange(e, idx)}
                      min="0"
                      max="30"
                    />
                    <span>days before</span>
                  </div>
                ))}
                <p className="help-text">
                  Reminders will be sent on these days before the event date
                </p>
              </div>
            )}
          </div>

          <div className="settings-section">
            <h3>📅 Panchangam Configuration</h3>

            <div className="reminder-toggle">
              <label>
                <input
                  type="checkbox"
                  name="panchangamFetchEnabled"
                  checked={settings.panchangamFetchEnabled}
                  onChange={handleChange}
                />
                <span>Auto-fetch panchangam data daily</span>
              </label>
            </div>

            <p className="help-text">
              Panchangam data will be automatically fetched from internet sources at 2:00 AM daily
            </p>
          </div>

          <div className="settings-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              <FiSave /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
