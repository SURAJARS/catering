import mongoose from 'mongoose';

/**
 * Settings Schema - Single document storing app configuration
 * Stores email preferences, reminder settings, and notification toggles
 */
const SettingsSchema = new mongoose.Schema(
  {
    // Email Configuration
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    // Reminder Configuration (days before event)
    reminderDays: {
      type: [Number],
      default: [1, 3],
    },

    // Notification Toggles
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    // Panchangam Configuration
    panchangamFetchEnabled: {
      type: Boolean,
      default: true,
    },
    panchangamDataDaysAhead: {
      type: Number,
      default: 90, // Fetch 90 days ahead
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
SettingsSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const count = await this.constructor.countDocuments({});
    if (count > 0) {
      return next(new Error('Settings document already exists'));
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model('Settings', SettingsSchema);
