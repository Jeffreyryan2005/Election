# 🚀 SKILLFORGE DEPLOYMENT CHECKLIST

## Pre-Deployment Verification ✅

### Code Quality
- [x] Frontend production build successful (`npm run build`)
- [x] Backend requirements.txt includes gunicorn
- [x] TypeScript config cleaned up (removed deprecated settings)
- [x] Environment variables documented (.env.example files created)
- [x] API health endpoint verified (returns 200)
- [x] CORS enabled on backend

### Testing
- [x] Backend health check: `GET /api/health` → `{"status": "ok", "model": "llama-3.3-70b-versatile"}`
- [x] Frontend dev server running on port 3001
- [x] Sample analysis working locally (60% match score verified)
- [x] File upload PDF functionality available
- [x] Learning plan accordion working
- [x] All animations smooth and responsive

### Security
- [x] No hardcoded API keys in code
- [x] GROQ_API_KEY injected via environment variables
- [x] CORS properly configured
- [x] PyPDF2 for secure PDF parsing

---

## 🔧 BACKEND DEPLOYMENT (Render.com)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended for auto-deploy)
3. Authorize GitHub access

### Step 2: Create Web Service
1. Click **Dashboard** → **New +** → **Web Service**
2. Select GitHub repository: `SkillForge`
3. Configure settings:

| Field | Value |
|-------|-------|
| **Name** | `skillforge-backend` |
| **Environment** | `Python 3` |
| **Region** | Oregon (or closest to you) |
| **Branch** | `main` |
| **Auto-deploy** | ✅ Yes |

### Step 3: Build & Start Commands
```
Build Command:  pip install -r backend/requirements.txt
Start Command:  gunicorn app:app --chdir backend --bind 0.0.0.0:$PORT
```

### Step 4: Environment Variables
Click **Environment** and add:

| Key | Value | Source |
|-----|-------|--------|
| `GROQ_API_KEY` | `gsk_...` | https://console.groq.com/keys |

⚠️ **IMPORTANT**: Copy your actual Groq API key from https://console.groq.com/keys

### Step 5: Deploy
1. Click **Create Web Service**
2. Wait 2-5 minutes for deployment
3. Once live, view your service URL (e.g., `https://skillforge-backend.onrender.com`)

### Step 6: Test Backend
```bash
# Test health endpoint
curl https://skillforge-backend.onrender.com/api/health

# Expected response:
# {"status":"ok","model":"llama-3.3-70b-versatile"}
```

**Your Backend URL**: _______________________________________________

---

## 🎨 FRONTEND DEPLOYMENT (Vercel.com)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize GitHub access

### Step 2: Import Project
1. Click **Add New** → **Project**
2. Select GitHub repository: `SkillForge`
3. Click **Import**

### Step 3: Configure Project
When prompted, set:

| Field | Value |
|-------|-------|
| **Framework** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Install Command** | `npm install` |

### Step 4: Environment Variables
Before deploying, click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://skillforge-backend.onrender.com` |

⚠️ **CRITICAL**: Use your actual Render backend URL from Step 5 above!

### Step 5: Deploy
1. Click **Deploy**
2. Wait 1-3 minutes for deployment to complete
3. Once live, Vercel shows your site URL (e.g., `https://skillforge.vercel.app`)

### Step 6: Test Frontend
1. Visit your Vercel URL
2. Click **Try Sample** button
3. Verify sample data populates
4. Click **Analyze My Skills**
5. Verify 60% match score appears with results

**Your Frontend URL**: _______________________________________________

---

## ✅ POST-DEPLOYMENT VERIFICATION

### 1. Test Backend Connectivity
```bash
curl https://skillforge-backend.onrender.com/api/health
# Should return: {"status":"ok","model":"llama-3.3-70b-versatile"}
```

### 2. Test Frontend in Production
1. Visit your Vercel URL
2. Open browser console (F12)
3. Click **Try Sample**
4. Verify no errors in console
5. Click **Analyze My Skills**
6. ✅ Confirm results appear

### 3. Verify API Integration
- Check network tab shows successful API call to Render backend
- Confirm response time < 3 seconds
- Verify 60% match score appears

### 4. Test All Features
- [ ] Sample data loads
- [ ] Analysis executes
- [ ] Results display with match score
- [ ] Skill tags show correctly (matched vs gap)
- [ ] Learning plan accordion works
- [ ] Radar chart renders
- [ ] Mobile responsive (test on phone)

---

## 🐛 TROUBLESHOOTING

### Frontend shows "API Error" or "Failed to connect"
**Cause**: Backend URL misconfigured or backend not running
**Fix**: 
1. Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Ensure URL matches your Render backend (no trailing slash)
3. Test backend URL directly in browser: `https://skillforge-backend.onrender.com/api/health`

### Backend returns empty/mock results
**Cause**: `GROQ_API_KEY` not set
**Fix**:
1. Get key from https://console.groq.com/keys
2. Add to Render environment variables
3. Restart service: Render Dashboard → Service → Manual Deploy

### Build fails on Vercel
**Cause**: TypeScript or dependency error
**Fix**:
1. Check Vercel build logs
2. Ensure all dependencies in `frontend/package.json`
3. Run `npm run build` locally to reproduce

### Build fails on Render
**Cause**: Missing gunicorn or bad Python version
**Fix**:
1. Check `requirements.txt` includes `gunicorn>=21.2.0`
2. Verify `--chdir backend` in start command
3. Check Python version matches local development

---

## 📊 PERFORMANCE EXPECTATIONS

| Metric | Expected |
|--------|----------|
| Frontend First Load | < 2 seconds |
| Analysis Response Time | 2-5 seconds |
| Match Score Display | Instant (60%) |
| Skill Tags Render | < 1 second |
| Learning Plan Loads | < 1 second |
| Mobile Responsiveness | Full support |

---

## 🔒 SECURITY CHECKLIST

- [x] No hardcoded API keys in Git
- [x] GROQ_API_KEY only in environment variables
- [x] CORS restricted to Vercel domain
- [x] HTTPS enforced (Render + Vercel auto)
- [x] PDF parsing sanitized (PyPDF2)
- [x] Input validation on both frontend & backend

---

## 🎯 QUICK REFERENCE

### Render Dashboard
- **URL**: https://dashboard.render.com
- **Service Name**: `skillforge-backend`
- **View Logs**: Services → skillforge-backend → Logs

### Vercel Dashboard
- **URL**: https://vercel.com
- **Project Name**: `SkillForge`
- **View Logs**: Deployments → Logs

### Groq Console
- **URL**: https://console.groq.com/keys
- **Get API Key**: Copy from this page

---

## 🚀 AUTO-DEPLOY WORKFLOW

Both platforms are configured for auto-deploy:

```
1. Push to main branch
   ↓
2. GitHub webhook triggers
   ↓
3. Render rebuilds backend (2-5 min)
4. Vercel rebuilds frontend (1-3 min)
   ↓
5. Changes live automatically
```

**You don't need to do anything after git push!**

---

## 📱 TESTING ON MOBILE

1. Get your Vercel URL
2. Share link: `https://skillforge.vercel.app`
3. Test on phone:
   - Input fields responsive
   - Buttons clickable
   - Results readable
   - Animations smooth

---

## 💡 NEXT STEPS

- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Add custom domain (optional)
- [ ] Set up monitoring/alerts
- [ ] Share with judges/team
- [ ] Collect feedback
- [ ] Iterate based on results

---

## 📞 SUPPORT LINKS

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Groq API Docs**: https://console.groq.com/docs
- **GitHub Issues**: Create issue in your repo

---

**Last Updated**: 2026-06-11  
**Deployment Status**: 🟢 Ready for Production
