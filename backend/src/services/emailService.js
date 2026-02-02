import createEmailTransporter from '../config/email.js';
import Event from '../models/Event.js';
import Settings from '../models/Settings.js';

/**
 * Email Notification Service
 * Sends reminder emails for upcoming events
 * Configurable reminder days before event
 */

const transporter = createEmailTransporter();

/**
 * Email template for event reminder
 * @param {Object} event - Event document
 * @param {Number} daysUntil - Days until event
 * @returns {String} HTML email content
 */
const getEmailTemplate = (event, daysUntil) => {
  const eventDate = new Date(event.eventDate).toLocaleDateString('en-IN');
  const isToday = daysUntil === 0;
  const isTomorrow = daysUntil === 1;

  const timelineText = isToday
    ? '🎉 Your event is TODAY!'
    : isTomorrow
    ? '⏰ Your event is TOMORROW!'
    : `📅 Your event is in ${daysUntil} days`;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border-radius: 0 0 8px 8px; }
          .event-box { background: #f0f4ff; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px; }
          .event-box p { margin: 10px 0; }
          .label { font-weight: bold; color: #667eea; display: inline-block; width: 120px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .urgency { background: #fff3cd; padding: 15px; border-radius: 4px; margin: 15px 0; text-align: center; font-weight: bold; color: #856404; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Catering Event Reminder</h1>
          </div>
          <div class="content">
            <div class="urgency">
              ${timelineText}
            </div>
            
            <h2>Event Details</h2>
            <div class="event-box">
              <p><span class="label">Event Type:</span> ${event.eventType}</p>
              <p><span class="label">Date:</span> ${eventDate}</p>
              <p><span class="label">Time:</span> ${event.eventTime}</p>
              <p><span class="label">Client:</span> ${event.clientName}</p>
              <p><span class="label">Phone:</span> ${event.phoneNumber}</p>
              <p><span class="label">Location:</span> ${event.location}</p>
              ${event.notes ? `<p><span class="label">Notes:</span> ${event.notes}</p>` : ''}
            </div>

            <h2>Payment Summary</h2>
            <div class="event-box">
              <p><span class="label">Total Amount:</span> ₹${event.totalAmount.toLocaleString('en-IN')}</p>
              <p><span class="label">Advance Paid:</span> ₹${event.advancePaid.toLocaleString('en-IN')}</p>
              <p><span class="label">Balance Due:</span> ₹${event.balanceAmount.toLocaleString('en-IN')}</p>
            </div>

            ${event.balanceAmount > 0 ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 4px; margin: 20px 0; color: #856404;">
                <strong>⚠ Payment Reminder:</strong> Balance amount of ₹${event.balanceAmount.toLocaleString('en-IN')} is pending. Please collect before the event.
              </div>
            ` : ''}

            <p style="margin-top: 30px; text-align: center; color: #999; font-size: 14px;">
              This is an automated reminder. Please do not reply to this email.
            </p>
          </div>
          <div class="footer">
            <p>Catering Management System</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Send reminder email for an event
 * @param {Object} event - Event document
 * @param {Number} daysUntil - Days until event
 * @returns {Promise<Boolean>} Success status
 */
export const sendEventReminder = async (event, daysUntil) => {
  try {
    const settings = await Settings.findOne({});
    if (!settings || !settings.notificationsEnabled || !settings.email) {
      console.log('📧 Notifications disabled or email not configured');
      return false;
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: settings.email,
      subject: `Catering Reminder: ${event.eventType} on ${new Date(event.eventDate).toLocaleDateString('en-IN')} - ${daysUntil}d left`,
      html: getEmailTemplate(event, daysUntil),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Reminder email sent: ${event.clientName} (${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send reminder email: ${error.message}`);
    return false;
  }
};

/**
 * Send advance payment pending reminder
 * @param {Object} event - Event document with pending balance
 * @returns {Promise<Boolean>} Success status
 */
export const sendAdvancePendingReminder = async (event) => {
  try {
    const settings = await Settings.findOne({});
    if (!settings || !settings.notificationsEnabled || !settings.email) {
      return false;
    }

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
      to: settings.email,
      subject: `Payment Pending: ${event.clientName} - ₹${event.balanceAmount}`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert { background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ff9800; }
              .amount { font-size: 24px; font-weight: bold; color: #ff6b6b; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Payment Reminder</h2>
              <div class="alert">
                <p><strong>${event.clientName}</strong> has an outstanding balance:</p>
                <p class="amount">₹${event.balanceAmount.toLocaleString('en-IN')}</p>
                <p>Event: ${event.eventType} on ${new Date(event.eventDate).toLocaleDateString('en-IN')}</p>
                <p>Contact: ${event.phoneNumber}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Advance pending reminder sent: ${event.clientName}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send advance pending reminder: ${error.message}`);
    return false;
  }
};

/**
 * Check and send reminders for upcoming events
 * Called via cron job
 * @returns {Promise<Object>} Summary of emails sent
 */
export const checkAndSendReminders = async () => {
  try {
    const settings = await Settings.findOne({});
    if (!settings || !settings.notificationsEnabled) {
      console.log('📧 Notifications are disabled');
      return { success: false, emailsSent: 0 };
    }

    const reminderDays = settings.reminderDays || [1, 3];
    let emailsSent = 0;

    // Check each reminder day
    for (const day of reminderDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + day);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Find events on this date that are not cancelled
      const upcomingEvents = await Event.find({
        eventDate: { $gte: targetDate, $lt: nextDay },
        isCancelled: false,
      });

      for (const event of upcomingEvents) {
        await sendEventReminder(event, day);
        emailsSent++;
      }
    }

    // Also check for same-day morning reminders
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayEvents = await Event.find({
      eventDate: { $gte: todayStart, $lt: todayEnd },
      isCancelled: false,
    });

    for (const event of todayEvents) {
      await sendEventReminder(event, 0);
      emailsSent++;
    }

    console.log(`✓ Checked and sent ${emailsSent} reminder emails`);
    return { success: true, emailsSent };
  } catch (error) {
    console.error('Error checking and sending reminders:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendEventReminder,
  sendAdvancePendingReminder,
  checkAndSendReminders,
};
