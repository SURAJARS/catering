import express from 'express';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

/**
 * Event Routes
 * All routes follow REST conventions
 */

// GET /api/events - List all events with optional filters
router.get('/', eventController.getAllEvents);

// GET /api/events/stats/dashboard - Dashboard statistics
router.get('/stats/dashboard', eventController.getDashboardStats);

// GET /api/events/:id - Get single event
router.get('/:id', eventController.getEventById);

// POST /api/events - Create new event
router.post('/', eventController.createEvent);

// PUT /api/events/:id - Update event
router.put('/:id', eventController.updateEvent);

// DELETE /api/events/:id - Soft delete (mark as cancelled)
router.delete('/:id', eventController.deleteEvent);

export default router;
