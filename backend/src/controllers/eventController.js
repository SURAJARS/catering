import Event from '../models/Event.js';
import { sendSuccess, sendError, checkDoubleBooking, normalizeDate } from '../utils/responseUtils.js';

/**
 * Event Controller
 * Handles all event CRUD operations and business logic
 */

/**
 * GET /api/events - Fetch all events with optional filters
 * Query params: startDate, endDate, eventType
 */
export const getAllEvents = async (req, res) => {
  try {
    const { startDate, endDate, eventType } = req.query;
    const query = { isCancelled: false };

    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) {
        query.eventDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.eventDate.$lt = end;
      }
    }

    if (eventType) {
      query.eventType = eventType;
    }

    const events = await Event.find(query).sort({ eventDate: 1, eventTime: 1 });

    sendSuccess(res, events, 'Events fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching events: ${error.message}`);
  }
};

/**
 * GET /api/events/:id - Fetch single event
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    sendSuccess(res, event, 'Event fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching event: ${error.message}`);
  }
};

/**
 * POST /api/events - Create new event
 */
export const createEvent = async (req, res) => {
  try {
    const {
      eventDate,
      eventTime,
      eventType,
      clientName,
      clientNickname,
      phoneNumber,
      location,
      totalAmount,
      advancePaid,
      notes,
      eventPhotoUrl,
    } = req.body;

    // Validation
    if (!eventDate || !eventTime || !eventType || !clientName || !phoneNumber || !location || !totalAmount) {
      return sendError(res, 'Missing required fields', 400);
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return sendError(res, 'Phone number must be 10 digits', 400);
    }

    // Validate event time format (HH:MM)
    if (!/^\d{2}:\d{2}$/.test(eventTime)) {
      return sendError(res, 'Event time must be in HH:MM format', 400);
    }

    // Check for double booking
    const hasConflict = await checkDoubleBooking(Event, eventDate, eventTime);
    if (hasConflict) {
      return sendError(res, 'Double booking detected. Another event exists at this date and time.', 409);
    }

    // Create event
    const event = new Event({
      eventDate: new Date(eventDate),
      eventTime,
      eventType,
      clientName,
      clientNickname: clientNickname || '',
      phoneNumber,
      location,
      totalAmount: parseFloat(totalAmount),
      advancePaid: parseFloat(advancePaid) || 0,
      notes: notes || '',
      eventPhotoUrl: eventPhotoUrl || '',
    });

    await event.save();

    sendSuccess(res, event, 'Event created successfully', 201);
  } catch (error) {
    sendError(res, `Error creating event: ${error.message}`);
  }
};

/**
 * PUT /api/events/:id - Update event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventDate, eventTime, totalAmount, advancePaid, ...otherUpdates } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    // Check for double booking if date/time changed
    if (eventDate && eventTime && (eventDate !== event.eventDate || eventTime !== event.eventTime)) {
      const hasConflict = await checkDoubleBooking(Event, eventDate, eventTime, id);
      if (hasConflict) {
        return sendError(res, 'Double booking conflict. Another event exists at this date and time.', 409);
      }
    }

    // Update fields
    if (eventDate) event.eventDate = new Date(eventDate);
    if (eventTime) event.eventTime = eventTime;
    if (totalAmount !== undefined) event.totalAmount = parseFloat(totalAmount);
    if (advancePaid !== undefined) event.advancePaid = parseFloat(advancePaid);

    Object.assign(event, otherUpdates);

    await event.save();

    sendSuccess(res, event, 'Event updated successfully');
  } catch (error) {
    sendError(res, `Error updating event: ${error.message}`);
  }
};

/**
 * DELETE /api/events/:id - Soft delete (mark as cancelled)
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return sendError(res, 'Event not found', 404);
    }

    event.isCancelled = true;
    await event.save();

    sendSuccess(res, { _id: event._id, isCancelled: true }, 'Event cancelled successfully');
  } catch (error) {
    sendError(res, `Error deleting event: ${error.message}`);
  }
};

/**
 * GET /api/events/stats/dashboard - Dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { isCancelled: false };

    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) {
        query.eventDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        query.eventDate.$lt = end;
      }
    }

    // Calculate statistics
    const events = await Event.find(query);

    const stats = {
      totalEvents: events.length,
      totalRevenue: events.reduce((sum, e) => sum + e.totalAmount, 0),
      totalAdvanceReceived: events.reduce((sum, e) => sum + e.advancePaid, 0),
      totalPendingBalance: events.reduce((sum, e) => sum + e.balanceAmount, 0),
      eventsByType: {},
      upcomingEvents: [],
      overduePayments: [],
    };

    // Group by event type
    events.forEach((e) => {
      if (!stats.eventsByType[e.eventType]) {
        stats.eventsByType[e.eventType] = 0;
      }
      stats.eventsByType[e.eventType]++;
    });

    // Upcoming events (next 30 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in30Days = new Date(today);
    in30Days.setDate(in30Days.getDate() + 30);

    stats.upcomingEvents = events
      .filter((e) => e.eventDate >= today && e.eventDate <= in30Days)
      .sort((a, b) => a.eventDate - b.eventDate)
      .slice(0, 10);

    // Overdue payments
    stats.overduePayments = events
      .filter((e) => e.balanceAmount > 0 && e.eventDate < today)
      .sort((a, b) => b.balanceAmount - a.balanceAmount);

    sendSuccess(res, stats, 'Dashboard stats fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching dashboard stats: ${error.message}`);
  }
};

/**
 * POST /api/events/search - Search events by various criteria
 * Body: { query: string }
 * Searches in: clientName, clientNickname, phoneNumber, eventType, location, notes
 */
export const searchEvents = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return sendError(res, 'Search query is required', 400);
    }

    const searchQuery = query.trim();
    const regex = new RegExp(searchQuery, 'i'); // Case-insensitive search

    // Search in multiple fields
    const events = await Event.find({
      $and: [
        { isCancelled: false },
        {
          $or: [
            { clientName: { $regex: regex } },
            { clientNickname: { $regex: regex } },
            { phoneNumber: { $regex: regex } },
            { eventType: { $regex: regex } },
            { location: { $regex: regex } },
            { notes: { $regex: regex } },
          ],
        },
      ],
    })
      .sort({ eventDate: -1 })
      .limit(50);

    sendSuccess(res, events, `Found ${events.length} matching events`);
  } catch (error) {
    sendError(res, `Error searching events: ${error.message}`);
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getDashboardStats,
  searchEvents,
};
