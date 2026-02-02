# 🚀 DEPLOYMENT GUIDE - Amman Catering

## ✅ COMPLETED

- ✅ MongoDB Atlas connected and verified
- ✅ Backend ready for production
- ✅ Frontend configured for API endpoints
- ✅ Environment variables set up

## 📋 DEPLOYMENT STEPS

### **1. Deploy Backend (Railway.app - Recommended)**

**Step 1.1: Create Railway Account**

- Go to https://railway.app
- Sign up with GitHub

**Step 1.2: Create New Project**

- Click "New Project"
- Select "Deploy from GitHub"
- Connect your GitHub account
- Select your `catering` repository

**Step 1.3: Configure Backend**

- Select the backend folder as root (if needed)
- Go to Variables tab
- Add these environment variables:
  ```
  MONGODB_URI=mongodb+srv://admin:admin@ramyasfood.hn78phd.mongodb.net/catering_management?appName=ramyasfood
  PORT=5000
  NODE_ENV=production
  FRONTEND_URL=https://your-frontend-url.vercel.app (add after frontend deployment)
  ```

**Step 1.4: Deploy**

- Click "Deploy"
- Wait for deployment (2-3 minutes)
- Copy your backend URL: `https://xxxx-production.railway.app`

---

### **2. Deploy Frontend (Vercel.com - Recommended)**

**Step 2.1: Create Vercel Account**

- Go to https://vercel.com
- Sign up with GitHub

**Step 2.2: Create New Project**

- Click "New Project"
- Import your `catering` repository
- Select Frontend folder as root

**Step 2.3: Configure Frontend**

- Add Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url/api
  ```
  (Replace with your Railway backend URL from Step 1.4)

**Step 2.4: Deploy**

- Click "Deploy"
- Wait for deployment (1-2 minutes)
- Get your frontend URL: `https://your-app.vercel.app`

---

### **3. Update Backend with Frontend URL**

- Go back to Railway project
- Update `FRONTEND_URL` variable with your Vercel URL

---

## 🎯 QUICK COMMANDS

**Backend Environment Variables (copy to Railway):**

```
MONGODB_URI=mongodb+srv://admin:admin@ramyasfood.hn78phd.mongodb.net/catering_management?appName=ramyasfood
PORT=5000
NODE_ENV=production
FRONTEND_URL=(add after frontend deployed)
PANCHANGAM_API_URL=https://www.prokerala.com/api/panchangam/
PANCHANGAM_FETCH_HOUR=2
PANCHANGAM_FETCH_MINUTE=0
REMINDER_DAYS=1,3
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
```

**Frontend Environment Variable (copy to Vercel):**

```
VITE_API_URL=(your-railway-backend-url)/api
```

---

## 📊 YOUR APP WILL BE:

- 🌐 **Live at**: https://your-app.vercel.app
- 🗄️ **Database**: MongoDB Atlas (ramyasfood cluster)
- 🔄 **Auto-scaling**: Yes (free tier)
- 💰 **Cost**: FREE

---

## ✅ TESTING AFTER DEPLOYMENT

1. Open your Vercel URL
2. Create a test event
3. Check MongoDB Atlas to verify data saved
4. Calendar should show panchangam colors
5. Events should persist after refresh

---

## 🆘 TROUBLESHOOTING

**"Cannot reach API"**

- Check VITE_API_URL in Vercel is correct
- Check CORS in backend (should work automatically)

**"Database connection failed"**

- Verify MongoDB Atlas password is correct
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0 for public access)

**"Events not showing"**

- Check browser console for errors
- Verify API URL matches Railway deployment URL

---

## 🎉 YOU'RE DONE!

Your Amman Catering app is now LIVE! 🚀
