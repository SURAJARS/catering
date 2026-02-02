# Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Error Response Format

All errors return a standard format:

```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional details (if available)"
}
```

---

## Events API

### List Events

```
GET /events?startDate=2024-01-01&endDate=2024-12-31&eventType=Marriage
```

**Query Parameters:**

- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `eventType` (optional): Marriage, Reception, Engagement, Other

**Response:**

```json
{
  "success": true,
  "message": "Events fetched successfully",
  "data": [
    {
      "_id": "...",
      "eventDate": "2024-01-15T00:00:00.000Z",
      "eventTime": "18:00",
      "eventType": "Marriage",
      "clientName": "John Doe",
      "phoneNumber": "9876543210",
      "location": "Grand Hotel, Chennai",
      "totalAmount": 100000,
      "advancePaid": 50000,
      "balanceAmount": 50000,
      "notes": "Include south Indian catering",
      "isCancelled": false,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### Get Single Event

```
GET /events/{id}
```

**Response:**

```json
{
  "success": true,
  "message": "Event fetched successfully",
  "data": {
    /* event object */
  }
}
```

### Create Event

```
POST /events
Content-Type: application/json

{
  "eventDate": "2024-02-14",
  "eventTime": "18:30",
  "eventType": "Marriage",
  "clientName": "Jane Smith",
  "phoneNumber": "9876543210",
  "location": "Wedding Hall, Bangalore",
  "totalAmount": 150000,
  "advancePaid": 75000,
  "notes": "Vegetarian menu preferred"
}
```

**Validation:**

- `eventDate`: Required, valid date
- `eventTime`: Required, HH:MM format
- `eventType`: Required, one of enum
- `clientName`: Required, non-empty
- `phoneNumber`: Required, exactly 10 digits
- `location`: Required, non-empty
- `totalAmount`: Required, > 0
- `advancePaid`: Optional, >= 0
- `notes`: Optional, string

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    /* created event */
  }
}
```

**Error (409 Conflict):**

```json
{
  "success": false,
  "message": "Double booking detected. Another event exists at this date and time."
}
```

### Update Event

```
PUT /events/{id}
Content-Type: application/json

{
  "clientName": "Jane Smith Updated",
  "totalAmount": 160000,
  "advancePaid": 80000
}
```

**Note:** Only changed fields are required. Balance auto-calculates.

**Response:**

```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    /* updated event */
  }
}
```

### Cancel Event (Soft Delete)

```
DELETE /events/{id}
```

**Response:**

```json
{
  "success": true,
  "message": "Event cancelled successfully",
  "data": {
    "_id": "...",
    "isCancelled": true
  }
}
```

### Dashboard Statistics

```
GET /events/stats/dashboard?startDate=2024-01-01&endDate=2024-12-31
```

**Response:**

```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalEvents": 15,
    "totalRevenue": 1500000,
    "totalAdvanceReceived": 900000,
    "totalPendingBalance": 600000,
    "eventsByType": {
      "Marriage": 5,
      "Reception": 4,
      "Engagement": 3,
      "Other": 3
    },
    "upcomingEvents": [
      /* next 10 events */
    ],
    "overduePayments": [
      /* events with pending balance */
    ]
  }
}
```

---

## Panchangam API

### Get Panchangam Range

```
GET /panchangam/range?startDate=2024-01-01&endDate=2024-01-31
```

**Required Query Parameters:**

- `startDate`: YYYY-MM-DD
- `endDate`: YYYY-MM-DD

**Response:**

```json
{
  "success": true,
  "message": "Panchangam data fetched successfully",
  "data": [
    {
      "_id": "...",
      "date": "2024-01-15T00:00:00.000Z",
      "tithi": "Krishna Tritiya",
      "nakshatra": "Magha",
      "rahukalam": {
        "startTime": "07:48",
        "endTime": "09:24"
      },
      "yamagandam": {
        "startTime": "14:00",
        "endTime": "15:36"
      },
      "kuligai": {
        "startTime": "09:24",
        "endTime": "10:12"
      },
      "auspiciousTimes": [
        {
          "type": "Marriage",
          "startTime": "18:00",
          "endTime": "20:00"
        }
      ],
      "isMarriageDay": true,
      "isAuspiciousDay": true,
      "festival": "Makar Sankranti",
      "isAmavasai": false,
      "isPournami": false
    }
  ]
}
```

### Get Specific Date Panchangam

```
GET /panchangam/date/2024-01-15
```

**Response:** Single panchangam object (same format as above)

### Get Auspicious Marriage Days

```
GET /panchangam/auspicious-days?startDate=2024-01-01&endDate=2024-01-31
```

**Response:**

```json
{
  "success": true,
  "message": "Auspicious days fetched successfully",
  "data": [
    {
      "date": "2024-01-15T00:00:00.000Z",
      "festival": "Makar Sankranti",
      "tithi": "Krishna Tritiya",
      "nakshatra": "Magha",
      "auspiciousTimes": [...]
    }
  ]
}
```

### Get Event Suggestions

```
GET /panchangam/suggestions/2024-02-14/Marriage
```

**Path Parameters:**

- `:eventDate`: YYYY-MM-DD
- `:eventType`: Marriage, Reception, Engagement, Other

**Response:**

```json
{
  "success": true,
  "message": "Panchangam suggestions fetched",
  "data": {
    "date": "2024-02-14T00:00:00.000Z",
    "isAuspicious": true,
    "message": "✅ Auspicious marriage day",
    "warnings": [
      {
        "type": "Rahukalam",
        "startTime": "07:48",
        "endTime": "09:24",
        "message": "⚠ Rahukalam period - generally avoided"
      }
    ],
    "auspiciousTimes": [
      {
        "type": "Marriage",
        "startTime": "18:00",
        "endTime": "20:00"
      }
    ],
    "festival": "Valentine's Day"
  }
}
```

---

## Settings API

### Get Settings

```
GET /settings
```

**Response:**

```json
{
  "success": true,
  "message": "Settings fetched successfully",
  "data": {
    "_id": "...",
    "email": "user@gmail.com",
    "reminderDays": [1, 3],
    "notificationsEnabled": true,
    "panchangamFetchEnabled": true,
    "panchangamDataDaysAhead": 90,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### Update Settings

```
PUT /settings
Content-Type: application/json

{
  "email": "newemail@gmail.com",
  "reminderDays": [1, 2, 3],
  "notificationsEnabled": true,
  "panchangamFetchEnabled": true
}
```

**Fields:** All optional, only provide fields to update

**Response:** Updated settings object

### Send Test Email

```
POST /settings/test-email
Content-Type: application/json

{
  "email": "test@example.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Test email sent successfully",
  "data": {
    "sent": true
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "Failed to send test email"
}
```

---

## Health Check

### API Status

```
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "uptime": 3600
}
```

---

## HTTP Status Codes

| Code | Meaning                         |
| ---- | ------------------------------- |
| 200  | Success                         |
| 201  | Created                         |
| 400  | Bad Request (validation error)  |
| 404  | Not Found                       |
| 409  | Conflict (e.g., double booking) |
| 500  | Server Error                    |

---

## Request/Response Formatting

### Date Format

All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

### Time Format

All times are in 24-hour format: `HH:MM`

### Currency

All amounts in Indian Rupees (₹), stored as numbers (no currency symbol)

---

## Rate Limiting

Currently no rate limiting. Production deployment should implement limits via nginx/reverse proxy.

---

## CORS

Allowed origins:

- `http://localhost:5173` (development)
- Configured via `FRONTEND_URL` env variable

---

## Authentication

**Note:** Currently single-user app with no authentication. For multi-user deployment, add JWT tokens to all requests.

---

## Example cURL Commands

### Create Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventDate": "2024-02-14",
    "eventTime": "18:30",
    "eventType": "Marriage",
    "clientName": "Test User",
    "phoneNumber": "9876543210",
    "location": "Test Hall",
    "totalAmount": 100000,
    "advancePaid": 50000
  }'
```

### Get Events

```bash
curl http://localhost:5000/api/events?startDate=2024-01-01&endDate=2024-12-31
```

### Get Panchangam

```bash
curl http://localhost:5000/api/panchangam/range?startDate=2024-01-01&endDate=2024-01-31
```

### Send Test Email

```bash
curl -X POST http://localhost:5000/api/settings/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

**Last Updated:** January 2024
