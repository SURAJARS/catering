import Panchangam from '../models/Panchangam.js';
import { sendSuccess, sendError } from '../utils/responseUtils.js';

/**
 * Panchangam Controller
 * Handles panchangam data retrieval (read-only)
 * User cannot modify panchangam data
 */

/**
 * GET /api/panchangam/range - Fetch panchangam for date range
 * Query params: startDate, endDate
 */
export const getPanchangamRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return sendError(res, 'startDate and endDate query parameters are required', 400);
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    const panchangamData = await Panchangam.find({
      date: { $gte: start, $lt: end },
    }).select('-rawData').lean();

    sendSuccess(res, panchangamData, 'Panchangam data fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching panchangam: ${error.message}`);
  }
};

/**
 * GET /api/panchangam/date/:date - Fetch panchangam for specific date
 * Param: date (YYYY-MM-DD format)
 */
export const getPanchangamForDate = async (req, res) => {
  try {
    const { date } = req.params;

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const panchangam = await Panchangam.findOne({ date: targetDate }).select('-rawData').lean();

    if (!panchangam) {
      return sendError(res, 'Panchangam data not found for this date', 404);
    }

    sendSuccess(res, panchangam, 'Panchangam data fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching panchangam: ${error.message}`);
  }
};

/**
 * GET /api/panchangam/auspicious-days - Get auspicious marriage days in range
 * Query params: startDate, endDate
 */
export const getAuspiciousDays = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return sendError(res, 'startDate and endDate query parameters are required', 400);
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    const auspiciousDays = await Panchangam.find({
      date: { $gte: start, $lt: end },
      isMarriageDay: true,
      isAuspiciousDay: true,
    })
      .select('date festival tithi nakshatra auspiciousTimes')
      .lean();

    sendSuccess(res, auspiciousDays, 'Auspicious days fetched successfully');
  } catch (error) {
    sendError(res, `Error fetching auspicious days: ${error.message}`);
  }
};

/**
 * GET /api/panchangam/suggestions/:eventDate/:eventType
 * Get panchangam suggestions when user selects an event date
 */
export const getPanchangamSuggestions = async (req, res) => {
  try {
    const { eventDate, eventType } = req.params;

    const targetDate = new Date(eventDate);
    targetDate.setHours(0, 0, 0, 0);

    const panchangam = await Panchangam.findOne({ date: targetDate }).lean();

    const suggestions = {
      date: targetDate,
      isAuspicious: false,
      warnings: [],
      auspiciousTimes: [],
    };

    if (!panchangam) {
      suggestions.message = 'Panchangam data not available for this date';
      return sendSuccess(res, suggestions);
    }

    // Check if it's an auspicious day for the event type
    if (eventType === 'Marriage') {
      suggestions.isAuspicious = panchangam.isMarriageDay && panchangam.isAuspiciousDay;
      if (suggestions.isAuspicious) {
        suggestions.message = '✅ Auspicious marriage day';
      }
    }

    // Add warnings for inauspicious time slots
    if (panchangam.rahukalam) {
      suggestions.warnings.push({
        type: 'Rahukalam',
        startTime: panchangam.rahukalam.startTime,
        endTime: panchangam.rahukalam.endTime,
        message: '⚠ Rahukalam period - generally avoided',
      });
    }

    if (panchangam.yamagandam) {
      suggestions.warnings.push({
        type: 'Yamagandam',
        startTime: panchangam.yamagandam.startTime,
        endTime: panchangam.yamagandam.endTime,
        message: '⚠ Yamagandam period - avoid important events',
      });
    }

    // Add auspicious times
    if (panchangam.auspiciousTimes && panchangam.auspiciousTimes.length > 0) {
      suggestions.auspiciousTimes = panchangam.auspiciousTimes.filter(
        (t) => t.type === eventType || t.type === 'General'
      );
    }

    // Add festival info
    if (panchangam.festival) {
      suggestions.festival = panchangam.festival;
    }

    sendSuccess(res, suggestions, 'Panchangam suggestions fetched');
  } catch (error) {
    sendError(res, `Error fetching suggestions: ${error.message}`);
  }
};

export default {
  getPanchangamRange,
  getPanchangamForDate,
  getAuspiciousDays,
  getPanchangamSuggestions,
};
