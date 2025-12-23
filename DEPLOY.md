# Render Deployment Guide

## 🚀 Deploy to Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account

### Step 3: Deploy Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- Name: `hospital-queue-management`
- Environment: `Node`
- Region: Choose closest to you
- Branch: `main`

**Build & Deploy:**
- Build Command: chmod +x build.sh && ./build.sh
- Start Command: npm start

**Environment Variables:**
Click **"Add Environment Variable"** for each:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://mayurapallavi_db_user:7ihPUgTlvPOtoxlL@cluster0.o8j8prp.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_sunrise_hospital_2024
PORT=10000
```

**Important:** After deployment, get your Render URL (e.g., `https://hospital-queue-management.onrender.com`) and add:
```
CLIENT_URL=https://hospital-queue-management.onrender.com
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for build to complete (~5-10 minutes)
3. Your app will be live at the provided URL!

### Step 5: Seed Database (One-time)

**Option A: Run Locally (Recommended for Free Tier)**
Since shell access requires a paid plan, seed the database from your local machine:
```bash
node server/seed.js
```
This will connect to your MongoDB and create the initial users.

**Option B: Shell Access (Paid Plan Only)**
If you have a paid Render plan:
1. Go to your Render dashboard
2. Click on your service
3. Go to **"Shell"** tab
4. Run: `node server/seed.js`

### 🎉 Your App is Live!

**Login Credentials:**
- Admin: admin@hospital.com / admin123
- Staff: staff@hospital.com / staff123

### 📝 Notes:
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- For always-on service, upgrade to paid plan ($7/month)

### 🔧 Troubleshooting:
- Check **"Logs"** tab for any errors
- Ensure all environment variables are set
- Make sure MongoDB IP whitelist includes 0.0.0.0/0 (allow all)
