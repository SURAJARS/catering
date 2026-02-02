import Settings from '../models/Settings.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';

/**
 * Settings Controller
 * Manages app configuration (email, reminders, notifications)
 */

/**
 * GET /api/settings - Get current app settings
 */
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});

    // If no settings exist, create defaults
    if (!settings) {
      console.log('Creating default settings...');
      settings = await Settings.create({
        email: process.env.ADMIN_EMAIL || 'admin@catering.com',
        reminderDays: [1, 3],
        notificationsEnabled: true,
        panchangamFetchEnabled: true,
      });
      console.log('✓ Default settings created');
    }

    sendSuccess(res, settings, 'Settings fetched successfully');
  } catch (error) {
    console.error('Settings fetch error:', error);
    sendError(res, `Error fetching settings: ${error.message}`);
  }
};

/**
 * PUT /api/settings - Update app settings
 */
export const updateSettings = async (req, res) => {
  try {
    const { email, reminderDays, notificationsEnabled, panchangamFetchEnabled } = req.body;

    let settings = await Settings.findOne({});

    // Create if doesn't exist
    if (!settings) {
      settings = new Settings();
    }

    // Update fields
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return sendError(res, 'Invalid email format', 400);
      }
      settings.email = email;
    }

    if (reminderDays && Array.isArray(reminderDays)) {
      settings.reminderDays = reminderDays;
    }

    if (notificationsEnabled !== undefined) {
      settings.notificationsEnabled = notificationsEnabled;
    }

    if (panchangamFetchEnabled !== undefined) {
      settings.panchangamFetchEnabled = panchangamFetchEnabled;
    }

    await settings.save();

    sendSuccess(res, settings, 'Settings updated successfully');
  } catch (error) {
    sendError(res, `Error updating settings: ${error.message}`);
  }
};

/**
 * POST /api/settings/test-email - Send test email
 * Useful for user to verify email configuration
 */
export const sendTestEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email address is required', 400);
    }

    // Import email service here to avoid circular dependencies
    const { sendEventReminder } = await import('../services/emailService.js');

    // Create a mock event for testing
    const mockEvent = {
      eventType: 'Test Event',
      eventDate: new Date(),
      eventTime: '18:00',
      clientName: 'Test Client',
      phoneNumber: '9876543210',
      location: 'Test Location',
      totalAmount: 50000,
      advancePaid: 25000,
      balanceAmount: 25000,
      notes: 'This is a test event',
    };

    // Override email in settings temporarily
    const settings = await Settings.findOne({});
    const originalEmail = settings?.email;

    if (settings) {
      settings.email = email;
      await settings.save();
    }

    // Send test email
    const success = await sendEventReminder(mockEvent, 1);

    // Restore original email
    if (settings && originalEmail) {
      settings.email = originalEmail;
      await settings.save();
    }

    if (success) {
      sendSuccess(res, { sent: true }, 'Test email sent successfully');
    } else {
      sendError(res, 'Failed to send test email', 500);
    }
  } catch (error) {
    sendError(res, `Error sending test email: ${error.message}`);
  }
};

export default {
  getSettings,
  updateSettings,
  sendTestEmail,
};
