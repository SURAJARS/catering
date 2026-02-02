# 🍽️ Catering Management System

A private, single-user catering management web application with automatic Tamil Panchangam integration.

## Features

### ✨ Core Features

1. **Booking Management**
   - Create, edit, delete catering events
   - Event types: Marriage, Reception, Engagement, Other
   - Double-booking prevention
   - Payment tracking (Advance vs Balance)
   - Event cancellation support

2. **Panchangam Integration**
   - Auto-fetched Tamil calendar data daily
   - Visual calendar highlighting:
     - 🟢 Green: Auspicious marriage days
     - 🔴 Red: Inauspicious (Rahukalam/Yamagandam)
     - 🟡 Yellow: Neutral days
   - Smart suggestions when creating events
   - Warnings for inauspicious time slots

3. **Dashboard**
   - Total revenue & earnings summary
   - Advance vs balance overview
   - Event breakdown by type
   - Upcoming events (next 30 days)
   - Pending payment reminders

4. **Email Notifications**
   - Configurable reminder days (default: 1 & 3 days before)
   - Same-day morning reminders
   - Payment pending alerts
   - Clean, mobile-friendly email templates

5. **Calendar View**
   - Month/week/day navigation
   - Panchangam color coding
   - Event visualization
   - Date-based filtering

## Tech Stack

### Backend

- **Node.js + Express.js** - REST API server
- **MongoDB + Mongoose** - Database & ORM
- **Node-cron** - Scheduled jobs
- **Nodemailer** - Email service
- **Axios** - HTTP client for API calls

### Frontend

- **React 18** - UI library
- **Vite** - Build tool (instant hot reload)
- **React Calendar** - Calendar component
- **React Icons** - Icon library
- **Axios** - API calls

## Project Structure

```
catering/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & email config
│   │   ├── models/           # Mongoose schemas
│   │   ├── controllers/      # Business logic
│   │   ├── services/         # Panchangam & email services
│   │   ├── routes/           # API endpoints
│   │   ├── jobs/             # Cron jobs
│   │   ├── utils/            # Helper functions
│   │   └── index.js          # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   ├── styles/          # CSS files
    │   ├── api.js           # API client
    │   ├── config.js        # App config
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.* files
```

## Installation & Setup

### Prerequisites

- Node.js 16+
- MongoDB running locally or cloud connection
- Gmail account with app-password (for email)

### Backend Setup

1. **Navigate to backend:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create .env file:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   ```env
   MONGODB_URI=mongodb://localhost:27017/catering_management
   PORT=5000
   NODE_ENV=development

   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ADMIN_EMAIL=your-email@gmail.com

   # Panchangam
   PANCHANGAM_FETCH_HOUR=2
   PANCHANGAM_FETCH_MINUTE=0

   # Reminders
   REMINDER_DAYS=1,3

   FRONTEND_URL=http://localhost:5173
   ```

   **⚠️ Gmail Setup:**
   - Enable 2FA on your Google account
   - Generate an [App Password](https://myaccount.google.com/apppasswords)
   - Use the 16-character app password in `EMAIL_PASSWORD`

5. **Start MongoDB:**

   ```bash
   mongod
   ```

6. **Start backend server:**

   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start dev server:**

   ```bash
   npm run dev
   ```

   Frontend runs at `http://localhost:5173`

## API Endpoints

### Events

```
GET    /api/events                   # List events
GET    /api/events/:id               # Get event
POST   /api/events                   # Create event
PUT    /api/events/:id               # Update event
DELETE /api/events/:id               # Cancel event
GET    /api/events/stats/dashboard   # Dashboard stats
```

### Panchangam

```
GET /api/panchangam/range                          # Get date range
GET /api/panchangam/date/:date                     # Get specific date
GET /api/panchangam/auspicious-days                # Get marriage days
GET /api/panchangam/suggestions/:eventDate/:eventType  # Event suggestions
```

### Settings

```
GET  /api/settings           # Get settings
PUT  /api/settings           # Update settings
POST /api/settings/test-email # Send test email
```

## Database Schema

### Events Collection

```javascript
{
  eventDate: Date,
  eventTime: String,        // HH:MM format
  eventType: String,        // Marriage, Reception, Engagement, Other
  clientName: String,
  phoneNumber: String,      // 10 digits
  location: String,
  totalAmount: Number,
  advancePaid: Number,
  balanceAmount: Number,    // Auto-calculated
  notes: String,
  isCancelled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Panchangam Collection

```javascript
{
  date: Date,
  tithi: String,
  nakshatra: String,
  rahukalam: { startTime, endTime },
  yamagandam: { startTime, endTime },
  kuligai: { startTime, endTime },
  auspiciousTimes: Array,
  isMarriageDay: Boolean,
  isAuspiciousDay: Boolean,
  festival: String,
  isAmavasai: Boolean,
  isPournami: Boolean,
  rawData: Object,
  createdAt: Date
}
```

### Settings Collection

```javascript
{
  email: String,
  reminderDays: [Number],
  notificationsEnabled: Boolean,
  panchangamFetchEnabled: Boolean,
  panchangamDataDaysAhead: Number  // Default: 90
}
```

## Automation & Scheduled Jobs

### Panchangam Fetch Job

- **When:** Daily at 2:00 AM (configurable)
- **What:** Fetches 90 days of panchangam data
- **Source:** ProKerala API
- **Frequency:** Automatic via node-cron

### Email Reminder Job

- **When:** Daily at 8:00 AM
- **What:** Sends reminders for upcoming events
- **Configured:** Reminder days before event (default: 1, 3)
- **Frequency:** Automatic via node-cron

## Panchangam Data Source

The app fetches panchangam data from **ProKerala's public API**:

- Free, no authentication required
- Tamil calendar data with auspiciousness indicators
- Includes Rahukalam, Yamagandam, Muhurtham timings
- Marriage auspiciousness indicators

**Fallback Strategy:** If API fails, app continues with cached data

## Email Configuration

### Using Gmail:

1. Enable 2-Factor Authentication
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Set `EMAIL_PASSWORD` in `.env`

### Email Templates:

- Professional, mobile-friendly HTML
- Tamil-friendly text
- Includes payment summary
- Pending payment alerts
- Unsubscribe-friendly tone

## Deployment

### Production Build

**Frontend:**

```bash
cd frontend
npm run build
# Output: dist/ folder
```

**Backend:**

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=<cloud-mongo-url>
PORT=5000
FRONTEND_URL=https://yourdomain.com
```

### Using Docker

Create `Dockerfile` for backend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src ./src
CMD ["npm", "start"]
```

## Usage

### Creating an Event

1. Click "➕ New Event"
2. Fill in event details
3. System auto-checks for double booking
4. Shows panchangam suggestions
5. Click "Create Event"

### Viewing Panchangam

- Calendar shows color-coded days
- Hover over date for details
- Green = Auspicious for marriage
- Red = Avoid (Rahukalam)
- Yellow = Neutral

### Managing Settings

1. Go to "⚙️ Settings"
2. Configure email address
3. Set reminder days
4. Enable/disable notifications
5. Send test email to verify

### Dashboard Insights

- Total revenue and earnings
- Payment collection status
- Event breakdown by type
- Upcoming events list
- Overdue payments alert

## Development

### Run with Hot Reload

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Debug Mode

Backend logs all API calls and cron jobs. Frontend shows API errors in console.

## Troubleshooting

### MongoDB Connection Failed

- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Test connection: `mongodb://localhost:27017/test`

### Email Not Sending

- Verify Gmail app password (16 chars with spaces)
- Check `notificationsEnabled` in settings
- Send test email from Settings page
- Check backend logs for SMTP errors

### Panchangam Not Fetching

- Check internet connection
- Verify API URL is accessible
- Check cron logs: "Running scheduled Panchangam fetch"
- Data caches automatically for 90 days

### Double Booking Alert

- System prevents events at same date/time
- Modify existing event or choose different time

## Future Enhancements

- [ ] PWA support (offline mode)
- [ ] SMS reminders via Twilio
- [ ] WhatsApp notifications
- [ ] Receipt/Invoice generation
- [ ] Multi-user with roles
- [ ] Advanced reporting
- [ ] Android/iOS app
- [ ] Voice reminders
- [ ] Payment gateway integration

## License

Private - For personal use only

## Support

For issues or questions, check the logs:

- Backend: Console output
- Frontend: Browser DevTools
- Database: MongoDB logs

---

**Built with ❤️ for catering professionals**
