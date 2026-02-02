import express from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

/**
 * Settings Routes
 * User configuration management
 */

// GET /api/settings - Get current settings
router.get('/', settingsController.getSettings);

// PUT /api/settings - Update settings
router.put('/', settingsController.updateSettings);

// POST /api/settings/test-email - Send test email
router.post('/test-email', settingsController.sendTestEmail);

export default router;
