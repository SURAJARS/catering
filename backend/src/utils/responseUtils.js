/**
 * API Response Utilities
 * Standardized response formats for consistency
 */

export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message, statusCode = 500, details = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

/**
 * Validate double booking
 * Check if event already exists for same date/time
 */
export const checkDoubleBooking = async (EventModel, eventDate, eventTime, excludeEventId = null) => {
  const query = {
    eventDate: new Date(eventDate),
    eventTime,
    isCancelled: false,
  };

  if (excludeEventId) {
    query._id = { $ne: excludeEventId };
  }

  const existingEvent = await EventModel.findOne(query);
  return !!existingEvent;
};

/**
 * Normalize date to midnight UTC
 */
export const normalizeDate = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export default {
  sendSuccess,
  sendError,
  checkDoubleBooking,
  normalizeDate,
};
