# 🎯 SKILLFORGE: STEP-BY-STEP DEPLOYMENT GUIDE

## Overview
This guide will walk you through deploying SkillForge in 3 phases:
1. **Backend** on Render.com (free tier available)
2. **Frontend** on Vercel.com (free tier available)  
3. **Verification** and testing

**Total Time**: ~15-20 minutes  
**Cost**: Free (no credit card required for free tier)

---

## PHASE 1: BACKEND DEPLOYMENT (Render)

### 1.1 Create Render Account

**Action**: Go to https://render.com

Click **Sign Up** → Select **Sign up with GitHub** (recommended)

```
Sign Up Page
├─ Email: (auto-filled from GitHub)
├─ Continue with GitHub
└─ [Authorize]
```

### 1.2 Navigate to Dashboard

After signing in, click **Dashboard** in the left sidebar.

### 1.3 Create Web Service

1. Click the **New +** button (top right)
2. Select **Web Service**
3. Choose **Deploy an existing Git repository**
4. Click **Connect GitHub**

```
GitHub Connection
├─ Select Your Account
├─ Select Repository → SkillForge
└─ Click Install & Authorize
```

### 1.4 Configure Service Settings

After connecting your repo, you'll see a form:

```
Create a new Web Service
│
├─ Name: skillforge-backend
├─ Environment: Python 3
├─ Region: Oregon (or closest to your location)
├─ Branch: main
├─ Auto-deploy: Yes (toggle ON)
│
└─ Continue to next step
```

### 1.5 Add Build & Start Commands

On the same page, scroll to **Build Command** and **Start Command**:

```
Build Command:
    pip install -r backend/requirements.txt

Start Command:
    gunicorn app:app --chdir backend --bind 0.0.0.0:$PORT
```

⚠️ **Copy these EXACTLY** (including the `--chdir backend` part)

### 1.6 Add Environment Variables

Scroll to **Environment** section and click **+ Add Variable**

```
Add Environment Variable

Key:   GROQ_API_KEY
Value: gsk_... (paste your API key here)

[Add Variable]
```

**Where to get GROQ_API_KEY:**
1. Go to https://console.groq.com/keys
2. Click **Create API Key** (if needed)
3. Copy the key (starts with `gsk_`)
4. Paste it into Render

### 1.7 Deploy

Scroll to bottom and click **Create Web Service**

```
Status Timeline:
│
├─ Building... (2-3 minutes)
│  └─ pip install, building dependencies
│
├─ Starting... (1-2 minutes)
│  └─ Flask server initializing
│
└─ ✅ Live
   └─ Your backend is now running!
```

### 1.8 Get Your Backend URL

Once deployment completes, Render shows your service URL at the top:

```
https://skillforge-backend.onrender.com
```

**Save this URL** - you'll need it for the frontend!

### 1.9 Test Backend

1. Open a new browser tab
2. Visit: `https://skillforge-backend.onrender.com/api/health`
3. You should see:
   ```json
   {"status":"ok","model":"llama-3.3-70b-versatile"}
   ```

✅ **Backend is deployed!** → Proceed to Phase 2

---

## PHASE 2: FRONTEND DEPLOYMENT (Vercel)

### 2.1 Create Vercel Account

**Action**: Go to https://vercel.com

Click **Sign Up** → Select **Continue with GitHub**

```
Vercel Sign Up
├─ Sign up with GitHub (recommended)
├─ Click "Authorize Vercel by Vercel"
└─ ✅ Account created
```

### 2.2 Import Project

1. Click **Add New** (or **+ New Project**)
2. Select **Project**
3. You'll see GitHub repos - click **Import** next to **SkillForge**

```
Select Project to Import
├─ SkillForge (your repo)
└─ [Import]
```

### 2.3 Configure Project Settings

Vercel auto-detects Next.js. You should see:

```
Import Project

Project Name: SkillForge
Framework Preset: Next.js
Root Directory: frontend/  ← IMPORTANT: Must be "frontend/"

[Continue]
```

**If Root Directory is not set to `frontend/`:**
1. Click on the directory dropdown
2. Select **frontend**
3. Click **Confirm**

### 2.4 Set Environment Variables (⚠️ CRITICAL)

Before deploying, you'll see **Environment Variables** section:

```
Environment Variables

Name:  NEXT_PUBLIC_API_URL
Value: https://skillforge-backend.onrender.com

[Add]
[Deploy]
```

⚠️ **IMPORTANT**: 
- Replace `https://skillforge-backend.onrender.com` with YOUR actual backend URL from Phase 1
- Do NOT add a trailing slash (`/`)
- Must start with `https://` or `http://`

### 2.5 Deploy

1. Verify environment variable is set correctly
2. Click **Deploy**

```
Deployment Progress:
│
├─ Building... (1-2 minutes)
│  └─ Installing dependencies, compiling TypeScript
│
├─ Optimizing... (30 seconds)
│  └─ Creating optimized production bundle
│
└─ ✅ Live
   └─ Your frontend is now running!
```

### 2.6 Get Your Frontend URL

After deployment completes, Vercel shows:

```
🎉 Congratulations!

Your project is now available at:
https://skillforge.vercel.app
```

(or similar - may include custom domain)

**Save this URL** - this is your app link!

### 2.7 First Test

1. Click the URL or visit it in your browser
2. You should see the SkillForge homepage
3. If it shows an error → check backend URL in env variables

✅ **Frontend is deployed!** → Proceed to Phase 3

---

## PHASE 3: VERIFICATION & TESTING

### 3.1 Full End-to-End Test

**In your browser**, go to your frontend URL and:

#### Test 1: Sample Data
1. Click **Try Sample** button
2. Verify resume text appears in input field
3. Verify job description appears in input field

#### Test 2: Analysis
1. Click **Analyze My Skills** button
2. Wait 2-5 seconds for backend to respond
3. Verify results page loads with:
   - ✅ 60% match score circle
   - ✅ Skill tags (matched, gap)
   - ✅ Learning plan accordion
   - ✅ Stats: 11 resume skills, 8 required, 5 gaps

#### Test 3: Interactions
- Click **Week 1** in learning plan → should expand/collapse
- View skill tags → should have colors (green/red/orange)
- Mobile test → open on phone, verify responsive

### 3.2 Mobile Testing

1. Get your frontend URL
2. Open on phone (iOS/Android)
3. Test:
   - Text inputs are tappable
   - Buttons work correctly
   - Results display properly
   - No layout issues

### 3.3 Check Browser Console (F12)

1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Make sure no red errors appear
4. Run analysis again
5. Look for network requests to your backend

```
Network Tab → XHR
GET/POST https://skillforge-backend.onrender.com/api/analyze
Status: 200 ✅
```

### 3.4 Performance Check

Using DevTools → Network tab:

```
Expected Times:
├─ Page Load: < 2 seconds
├─ API Request: 2-5 seconds  
├─ Results Display: Instant
└─ Mobile Load: < 3 seconds
```

---

## TROUBLESHOOTING

### ❌ "Failed to connect to API" Error

**Cause**: Frontend can't reach backend

**Fix**:
1. Check backend URL: `https://skillforge-backend.onrender.com/api/health`
2. Verify it returns JSON (not an error page)
3. In Vercel, check environment variable `NEXT_PUBLIC_API_URL`
4. Redeploy Vercel after fixing: **Settings** → **Redeploy**

### ❌ Backend returns mock data (match score but no real analysis)

**Cause**: `GROQ_API_KEY` not set or invalid

**Fix**:
1. Get new key from https://console.groq.com/keys
2. Update in Render: **Service** → **Environment** → Edit `GROQ_API_KEY`
3. Manually deploy: **Service** → **Manual Deploy**

### ❌ Frontend won't load (blank page)

**Cause**: Build failed or bad config

**Fix**:
1. Check Vercel build logs: **Deployments** → **Building...**
2. Look for errors in build output
3. Common fix: Redeploy from Vercel dashboard

### ❌ Render service keeps spinning down (free tier)

**Cause**: Free tier spins down after 15 minutes of inactivity

**Workaround**:
- Upgrade to Starter ($7/month) for always-on
- Or accept 10-30 second startup time on first request

---

## 🎯 SUCCESS INDICATORS

✅ All of these should work:

1. Backend health check returns JSON
2. Frontend loads at Vercel URL
3. Sample data populates when clicking button
4. Analysis executes (returns 60% match)
5. Results display with all sections
6. No console errors
7. Mobile responsive
8. Page responsive to interactions

---

## 📊 DEPLOYMENT SUMMARY

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Backend | Render | https://skillforge-backend.onrender.com | ✅ Live |
| Frontend | Vercel | https://skillforge.vercel.app | ✅ Live |
| Analytics | Vercel Dashboard | https://vercel.com | 📊 Monitor |
| Logs | Render Dashboard | https://dashboard.render.com | 📋 View |

---

## 🔄 FUTURE UPDATES

### Auto-Deployment Enabled
Any push to `main` branch automatically:
- Redeploys backend on Render
- Redeploys frontend on Vercel
- Takes ~5-10 minutes total

### Manual Redeploy (if needed)
- **Render**: Service → Manual Deploy button
- **Vercel**: Deployments → Redeploy button

---

## 🎓 LEARNING RESOURCES

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs  
- **Next.js**: https://nextjs.org/docs
- **Flask**: https://flask.palletsprojects.com/
- **Groq API**: https://console.groq.com/docs

---

## 📧 SHARE YOUR APP

Now that it's deployed, you can share:
- **Live URL**: `https://skillforge.vercel.app`
- **GitHub Repo**: For code review
- **Demo Video**: Record walkthrough

---

**Status**: ✅ Ready to Deploy  
**Last Updated**: 2026-06-11  
**Questions?** Check troubleshooting section above
