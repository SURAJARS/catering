import mongoose from 'mongoose';

/**
 * Panchangam Schema - Stores Tamil calendar auspiciousness data
 * Auto-fetched from internet, READ-ONLY for user
 * Used for visual highlighting and event suggestions
 */
const PanchangamSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      unique: true,
      index: true,
    },
    
    // Tithi & Nakshatra (lunar day & constellation)
    tithi: {
      type: String,
      default: '',
    },
    nakshatra: {
      type: String,
      default: '',
    },

    // Inauspicious Time Slots
    rahukalam: {
      startTime: String, // Format: HH:MM
      endTime: String,   // Format: HH:MM
    },
    yamagandam: {
      startTime: String,
      endTime: String,
    },
    kuligai: {
      startTime: String,
      endTime: String,
    },

    // Auspicious Time Slots (Muhurtham)
    auspiciousTimes: [
      {
        type: {
          type: String,
          enum: ['Marriage', 'Reception', 'Engagement', 'General'],
        },
        startTime: String,
        endTime: String,
      },
    ],

    // Festival & Special Days
    isMarriageDay: {
      type: Boolean,
      default: false,
      index: true,
    },
    isAuspiciousDay: {
      type: Boolean,
      default: false,
      index: true,
    },
    festival: {
      type: String,
      default: '',
    },
    
    // Status Flag
    isAmavasai: Boolean,
    isPournami: Boolean,

    // Raw data (for debugging/reference)
    rawData: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
PanchangamSchema.index({ date: 1, isMarriageDay: 1 });

export default mongoose.model('Panchangam', PanchangamSchema);
