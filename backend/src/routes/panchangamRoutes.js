import express from 'express';
import * as panchangamController from '../controllers/panchangamController.js';

const router = express.Router();

/**
 * Panchangam Routes (Read-Only)
 * User cannot modify panchangam data
 * All routes are GET only
 */

// GET /api/panchangam/range - Fetch panchangam for date range
router.get('/range', panchangamController.getPanchangamRange);

// GET /api/panchangam/auspicious-days - Get auspicious marriage days
router.get('/auspicious-days', panchangamController.getAuspiciousDays);

// GET /api/panchangam/date/:date - Fetch panchangam for specific date
router.get('/date/:date', panchangamController.getPanchangamForDate);

// GET /api/panchangam/suggestions/:eventDate/:eventType - Get suggestions for event
router.get('/suggestions/:eventDate/:eventType', panchangamController.getPanchangamSuggestions);

export default router;
