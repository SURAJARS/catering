import mongoose from 'mongoose';

/**
 * Event Schema - Represents a catering booking
 * Stores all event details, payment info, and booking status
 */
const EventSchema = new mongoose.Schema(
  {
    // Event Details
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    eventTime: {
      type: String,
      required: [true, 'Event time is required'],
      match: /^\d{2}:\d{2}$/,
    },
    eventType: {
      type: String,
      enum: ['Marriage', 'Reception', 'Engagement', 'Other'],
      required: [true, 'Event type is required'],
    },

    // Client Information
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: /^[0-9]{10}$/,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    // Payment Details
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    advancePaid: {
      type: Number,
      default: 0,
      min: [0, 'Advance cannot be negative'],
    },
    balanceAmount: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },

    // Additional Info
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    isCancelled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-calculate balance
EventSchema.pre('save', function (next) {
  this.balanceAmount = this.totalAmount - this.advancePaid;
  next();
});

// Index for preventing double-booking
EventSchema.index({ eventDate: 1, eventTime: 1 });

export default mongoose.model('Event', EventSchema);
