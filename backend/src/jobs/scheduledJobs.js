import cron from 'node-cron';
import { fetchAndStorePanchangam } from '../services/panchangamService.js';
import { checkAndSendReminders } from '../services/emailService.js';

/**
 * Panchangam Fetch Job
 * Runs daily at configured time to fetch and update panchangam data
 * Default: 2:00 AM every day
 * 
 * Schedule: 0 2 * * * (02:00 every day)
 */
export const schedulePanchangamFetch = () => {
  const hour = parseInt(process.env.PANCHANGAM_FETCH_HOUR || '2');
  const minute = parseInt(process.env.PANCHANGAM_FETCH_MINUTE || '0');
  const schedule = `${minute} ${hour} * * *`;

  cron.schedule(schedule, async () => {
    console.log('\n📅 Running scheduled Panchangam fetch...');
    try {
      await fetchAndStorePanchangam();
      console.log('✓ Panchangam fetch completed\n');
    } catch (error) {
      console.error(`✗ Panchangam fetch failed: ${error.message}\n`);
    }
  });

  console.log(`✓ Panchangam fetch job scheduled for ${hour}:${minute.toString().padStart(2, '0')} daily`);
};

/**
 * Email Reminder Job
 * Runs daily at 8:00 AM to check for upcoming events and send reminders
 * 
 * Schedule: 0 8 * * * (08:00 every day)
 */
export const scheduleReminderEmails = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('\n📧 Running scheduled reminder email check...');
    try {
      const result = await checkAndSendReminders();
      if (result.success) {
        console.log(`✓ Reminder emails sent: ${result.emailsSent}\n`);
      } else {
        console.log(`⚠ Reminder check had issues\n`);
      }
    } catch (error) {
      console.error(`✗ Reminder email job failed: ${error.message}\n`);
    }
  });

  console.log('✓ Email reminder job scheduled for 08:00 daily');
};

/**
 * Initialize all scheduled jobs
 * Call this during app startup
 */
export const initializeScheduledJobs = () => {
  console.log('\n🚀 Initializing scheduled jobs...');
  schedulePanchangamFetch();
  scheduleReminderEmails();
  console.log('✓ All scheduled jobs initialized\n');
};

export default {
  schedulePanchangamFetch,
  scheduleReminderEmails,
  initializeScheduledJobs,
};
