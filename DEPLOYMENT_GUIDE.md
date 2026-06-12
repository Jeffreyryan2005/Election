# SkillForge Deployment Guide

## Overview
- **Frontend**: Next.js 14 deployed on **Vercel**
- **Backend**: Flask + Groq API deployed on **Render**

---

## Prerequisites

### Accounts Required
1. **Vercel Account** - https://vercel.com (free tier available)
2. **Render Account** - https://render.com (free tier available)
3. **Groq Account** - https://console.groq.com/keys (for API key)
4. **GitHub Account** - For connecting repositories

---

## Step 1: Backend Deployment on Render

### 1.1 Prepare Repository
```bash
# Make sure you have the latest code
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 1.2 Create Render Service
1. Go to **https://dashboard.render.com**
2. Click **New +** → **Web Service**
3. Select **Deploy an existing Git repository** or paste repository URL
4. Choose your SkillForge repository

### 1.3 Configure Web Service
- **Name**: `skillforge-backend`
- **Environment**: `Python 3`
- **Region**: Select closest to you (e.g., Oregon, Frankfurt, Singapore)
- **Branch**: `main`
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `gunicorn app:app --chdir backend --bind 0.0.0.0:$PORT`

### 1.4 Add Environment Variables
In Render dashboard, go to **Environment** tab:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | Your Groq API key from https://console.groq.com/keys |

### 1.5 Deploy
- Click **Create Web Service**
- Wait for deployment to complete (2-5 minutes)
- Copy your backend URL (e.g., `https://skillforge-backend.onrender.com`)
- Test health endpoint: `https://skillforge-backend.onrender.com/api/health`

---

## Step 2: Frontend Deployment on Vercel

### 2.1 Connect Repository to Vercel
1. Go to **https://vercel.com/new**
2. Import your GitHub repository
3. Select the root directory: `/` (Vercel will auto-detect Next.js in /frontend)
4. Or manually set:
   - **Root Directory**: `frontend`

### 2.2 Configure Build Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
In Vercel project settings, go to **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | Your Render backend URL (e.g., `https://skillforge-backend.onrender.com`) |

**Important**: Use `NEXT_PUBLIC_` prefix so the variable is available in the browser.

### 2.4 Deploy
- Click **Deploy**
- Wait for deployment to complete (1-3 minutes)
- Your app will be live at a URL like: `https://skillforge.vercel.app`

---

## Step 3: Verify Production Setup

### 3.1 Test Backend
```bash
curl https://skillforge-backend.onrender.com/api/health
# Should return: {"status": "ok", "model": "llama-3.3-70b-versatile"}
```

### 3.2 Test Frontend
1. Visit your Vercel URL (e.g., https://skillforge.vercel.app)
2. Click **Try Sample** button
3. Click **Analyze My Skills**
4. Verify results appear with 60% match score

### 3.3 Test File Upload (Optional)
1. Prepare a test PDF resume
2. Upload via the **Upload PDF Resume** button
3. Verify analysis works

---

## Step 4: Custom Domain (Optional)

### For Vercel:
1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `skillforge.dev`)
3. Follow DNS configuration steps

### For Render:
1. Backend custom domain available under **Settings** → **Custom Domain**

---

## Troubleshooting

### Backend not responding
1. Check Render logs: Dashboard → Logs
2. Verify `GROQ_API_KEY` is set in environment variables
3. Ensure start command is: `gunicorn app:app --chdir backend --bind 0.0.0.0:$PORT`

### Frontend showing API errors
1. Check browser console (F12)
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Ensure backend URL doesn't have trailing slash
4. Test CORS by visiting backend health endpoint in browser

### Build failing
1. Check build logs in Vercel/Render
2. Ensure all dependencies are in requirements.txt (backend) or package.json (frontend)
3. Verify Python/Node versions match local development

### Mock responses instead of real analysis
- Backend returns mock data if `GROQ_API_KEY` is not set
- Add the key to Render environment variables
- Restart the service after updating

---

## Production Monitoring

### Vercel
- **Analytics**: Project Settings → Analytics (view traffic, performance)
- **Function Logs**: Real-time logs of API calls
- **Deployments**: View all deployment history

### Render
- **Logs**: Real-time service logs
- **Metrics**: CPU, memory, request count
- **Alerts**: Set up notifications for service failures

---

## Auto-Deployment

Both Vercel and Render are configured for auto-deployment:
- Push to `main` branch → Automatic deployment
- Deployments typically complete in 2-5 minutes
- View deployment status in dashboard

---

## Environment Variables Summary

### Backend (Render)
```
GROQ_API_KEY = your_groq_api_key
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL = https://skillforge-backend.onrender.com
```

---

## Local Development

To test locally before deploying:

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
export GROQ_API_KEY=your_key
python -c "from app import app; app.run(debug=True)"
```

### Frontend
```bash
cd frontend
npm install
export NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
# Visit http://localhost:3000
```

---

## Cost Estimates

### Vercel (Frontend)
- **Free Tier**: Unlimited deployments, 100 GB bandwidth/month
- **Pro**: $20/month for advanced features

### Render (Backend)
- **Free Tier**: Spins down after 15 min of inactivity (startup delay)
- **Starter**: $7/month for always-on service
- **Plus**: $12/month with better performance

**Recommendation**: Start with free tier, upgrade if needed for production reliability.

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Test production environment
4. ✅ Configure custom domain (optional)
5. ✅ Set up monitoring and alerts
6. ✅ Share with team/judges

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Groq Docs**: https://console.groq.com/docs
