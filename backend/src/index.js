import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database connection
import connectDB from './config/database.js';

// Import models
import Settings from './models/Settings.js';

// Import routes
import eventRoutes from './routes/eventRoutes.js';
import panchangamRoutes from './routes/panchangamRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Import scheduled jobs and services
import { initializeScheduledJobs } from './jobs/scheduledJobs.js';
import { initializePanchangamData } from './services/panchangamService.js';

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Setup
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in production
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

/**
 * Database Connection
 */
connectDB();

/**
 * API Routes
 */
app.use('/api/events', eventRoutes);
app.use('/api/panchangam', panchangamRoutes);
app.use('/api/settings', settingsRoutes);

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * 404 Handler
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Wait for DB connection
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Initialize default settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('Creating default settings...');
      await Settings.create({
        email: process.env.ADMIN_EMAIL || 'admin@catering.com',
        reminderDays: [1, 3],
        notificationsEnabled: true,
        panchangamFetchEnabled: true,
      });
      console.log('✓ Default settings created');
    }

    // Initialize panchangam data on startup
    await initializePanchangamData();

    // Initialize scheduled jobs
    initializeScheduledJobs();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔════════════════════════════════════════════════════════╗
║     🍽️  Catering Management API                      ║
║     Server running on http://0.0.0.0:${PORT}                 ║
║     Local: http://localhost:${PORT}                       ║
║     Environment: ${process.env.NODE_ENV || 'development'}                    ║
║     Panchangam: ${process.env.PANCHANGAM_FETCH_HOUR}:${String(process.env.PANCHANGAM_FETCH_MINUTE).padStart(2, '0')} daily fetch          ║
╚════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
