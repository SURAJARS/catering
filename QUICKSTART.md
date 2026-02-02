# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install MongoDB

**Windows:**

- Download from [MongoDB Community](https://www.mongodb.com/try/download/community)
- Install and MongoDB will run as a service
- Verify: `mongosh` in command prompt

**Mac (Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu:**

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` with your Gmail:**

```env
MONGODB_URI=mongodb://localhost:27017/catering_management
PORT=5000
NODE_ENV=development

EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
ADMIN_EMAIL=your-email@gmail.com

PANCHANGAM_FETCH_HOUR=2
PANCHANGAM_FETCH_MINUTE=0

REMINDER_DAYS=1,3

FRONTEND_URL=http://localhost:5173
```

**⚠️ Gmail App Password:**

1. Go to https://myaccount.google.com
2. Enable 2-Step Verification
3. Go to App Passwords
4. Select "Mail" + "Windows Computer"
5. Copy 16-character password (includes spaces)
6. Paste into EMAIL_PASSWORD

**Start Backend:**

```bash
npm run dev
```

✓ Should see: `✓ MongoDB connected` and `Server running on http://localhost:5000`

### Step 3: Setup Frontend

```bash
# In another terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✓ Should see: `VITE v5.0.0 ready in ... ms` and `Local: http://localhost:5173`

### Step 4: Open in Browser

```
http://localhost:5173
```

✓ You should see the Catering Management app!

---

## First Use

### 1. Configure Settings

- Click ⚙️ Settings
- Enter your email
- Send a test email to verify
- Save settings

### 2. Create Your First Event

- Click ➕ New Event
- Fill in details:
  - Event Date: Pick a date
  - Event Type: Marriage
  - Client Name: Test Client
  - Phone: 9876543210
  - Location: Test Hall
  - Amount: 100000
- Click "Create Event"

### 3. View Dashboard

- Click 📊 Dashboard
- See your first booking
- Check earnings summary

### 4. Check Calendar

- Click 📅 Calendar
- See panchangam colors
- Select dates to view events

---

## Common Issues

### Issue: "Cannot connect to MongoDB"

**Solution:**

```bash
# Start MongoDB first
mongod

# Then start backend in another terminal
npm run dev
```

### Issue: "Email not sending"

**Check:**

1. Is 2FA enabled on Gmail? (Yes)
2. App password used? (16 chars with spaces)
3. Is `notificationsEnabled: true` in settings?
4. Try sending test email from Settings page

**Debug:**

- Check backend console for SMTP errors
- Verify email in Settings matches sender

### Issue: "Frontend can't connect to backend"

**Solution:**

- Backend running on port 5000? (check in terminal)
- Frontend running on 5173? (check in terminal)
- Check CORS: `FRONTEND_URL=http://localhost:5173` in backend .env

### Issue: "Panchangam data not showing"

**Solution:**

- Wait 2 minutes (first fetch happens at 2 AM)
- Or manually trigger:
  - Backend console should show: "Running scheduled Panchangam fetch"
  - Check MongoDB: `db.panchangams.find()` should have docs

---

## Development Workflow

### Terminal 1 - Backend (with auto-reload)

```bash
cd backend
npm run dev
# Watches for file changes and auto-restarts
```

### Terminal 2 - Frontend (with HMR)

```bash
cd frontend
npm run dev
# Instant hot reload on file save
```

### Terminal 3 - MongoDB (if not auto-started)

```bash
mongod
```

### Make Changes:

- Edit files in `src/`
- Auto-reload happens instantly
- Check browser/console for errors

---

## Database

### View Data in MongoDB

```bash
# Start MongoDB shell
mongosh

# Connect to database
use catering_management

# View collections
show collections

# View events
db.events.find().pretty()

# View panchangam
db.panchangams.find().pretty()

# View settings
db.settings.find().pretty()

# Delete all events (testing)
db.events.deleteMany({})
```

---

## Environment Variables

### Development (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/catering_management

# Server
PORT=5000
NODE_ENV=development

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
EMAIL_FROM_NAME=Catering Management
ADMIN_EMAIL=your-email@gmail.com

# Panchangam
PANCHANGAM_API_URL=https://www.prokerala.com/api/panchangam/
PANCHANGAM_FETCH_HOUR=2
PANCHANGAM_FETCH_MINUTE=0

# Notifications
REMINDER_DAYS=1,3

# CORS
FRONTEND_URL=http://localhost:5173
```

### Production (.env)

```env
MONGODB_URI=<cloud-mongodb-url>
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
# ... rest same as development
```

---

## Build for Production

### Frontend

```bash
cd frontend
npm run build
# Creates dist/ folder with optimized build
```

### Backend

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

---

## Testing

### Test Event Creation

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventDate": "2024-02-14",
    "eventTime": "18:30",
    "eventType": "Marriage",
    "clientName": "Test",
    "phoneNumber": "9876543210",
    "location": "Hall",
    "totalAmount": 100000,
    "advancePaid": 50000
  }'
```

### Test Email

1. Go to Settings
2. Enter email
3. Click "Send Test Email"
4. Check inbox (check spam folder)

### Test Double Booking

1. Create event on Jan 15 @ 18:30
2. Try to create another event on Jan 15 @ 18:30
3. Should show: "Double booking detected"

### Test Panchangam

1. Check calendar colors
2. Create event and see suggestions
3. Test recommendations in event form

---

## Logs

### Backend Logs

```
✓ MongoDB connected
✓ Panchangam fetch job scheduled
✓ Email reminder job scheduled
🔄 Running scheduled Panchangam fetch
✓ Panchangam data updated
📧 Running scheduled reminder email check
✓ Reminder emails sent: 2
```

### Frontend Logs (Browser DevTools)

- `F12` → Console tab
- Errors appear in red
- API calls in Network tab

---

## Next Steps

### Customize

- [ ] Edit colors in `frontend/src/config.js`
- [ ] Modify email templates in `backend/src/services/emailService.js`
- [ ] Change reminder times in `.env`
- [ ] Update calendar colors in CSS

### Deploy

- [ ] Setup production MongoDB (MongoDB Atlas)
- [ ] Setup email service (Sendgrid, Mailgun)
- [ ] Deploy backend (Heroku, Render, Railway)
- [ ] Deploy frontend (Vercel, Netlify)

### Enhance

- [ ] Add receipt generation
- [ ] Add photo gallery for events
- [ ] Add bulk email feature
- [ ] Add export to CSV/Excel

---

## Support

### Check Logs

1. **Backend:** Terminal where `npm run dev` runs
2. **Frontend:** Browser DevTools (F12)
3. **Database:** `mongosh` connection

### Common Commands

```bash
# Restart backend
Ctrl+C then npm run dev

# Clear MongoDB
mongosh
use catering_management
db.events.deleteMany({})

# Check MongoDB version
mongosh --version

# Check Node version
node --version
npm --version
```

### Restart Everything

```bash
# Kill all processes
Ctrl+C in each terminal

# Restart in order:
1. mongod
2. cd backend && npm run dev
3. cd frontend && npm run dev
```

---

## 🎉 You're Ready!

Your catering management system is running. Start creating bookings!

**Tips:**

- Calendar shows panchangam colors automatically
- Reminders send at 8 AM for configured days
- Panchangam data updates daily at 2 AM
- Test email from Settings page to verify email works

**Need help?** Check logs and error messages - they're very descriptive!
