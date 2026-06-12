# 📊 SKILLFORGE DEPLOYMENT FLOW DIAGRAM

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET                                 │
│                                                                 │
│     ┌──────────────────┐         ┌───────────────────────┐     │
│     │    VERCEL        │         │      RENDER           │     │
│     │  (Frontend)      │         │  (Backend + AI)       │     │
│     │                  │────────→│                       │     │
│     │  Next.js App     │ API     │  Flask + Groq API     │     │
│     │  React + Tailwind│ Calls   │  llama-3.3-70b        │     │
│     │  Framer Motion   │         │                       │     │
│     │                  │         │  PostgreSQL (future)  │     │
│     └──────────────────┘         └───────────────────────┘     │
│                                              │                  │
│                                              ↓                  │
│                                    ┌─────────────────┐          │
│                                    │  Groq Cloud     │          │
│                                    │  LLM API        │          │
│                                    │ llama-3.3-70b   │          │
│                                    └─────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

     ↑ Users                      ↑ GROQ_API_KEY
     │ Visit                      │ Environment Var
     │ Website                    │
     │                            │
   Browser              NEXT_PUBLIC_API_URL
```

---

## Deployment Timeline

```
START (Your Computer)
  │
  ├─→ [1] Get Groq API Key
  │     └─ 2 minutes
  │     └─ https://console.groq.com/keys
  │
  ├─→ [2] Deploy Backend to Render
  │     ├─ 5-10 minutes (first deploy)
  │     ├─ Git → GitHub webhook → Render build
  │     ├─ pip install, Flask startup
  │     └─ Backend URL ready ✓
  │
  ├─→ [3] Deploy Frontend to Vercel  
  │     ├─ 5-10 minutes (first deploy)
  │     ├─ Git → GitHub webhook → Vercel build
  │     ├─ npm install, Next.js compile
  │     └─ Frontend URL ready ✓
  │
  └─→ [4] Verify Everything Works
        ├─ 5 minutes
        ├─ Test API endpoint
        ├─ Test sample data
        ├─ Test analysis
        └─ ✅ LIVE!

TOTAL TIME: 20-30 minutes
```

---

## Step-by-Step Flow

### STEP 1: Get Groq API Key

```
YOU                                  GROQ CONSOLE
  │                                       │
  ├─────→ https://console.groq.com/keys ──→ │
  │                                       │
  │  ←─────────── gsk_... key ────────── │
  │                                       │
  SAVE KEY FOR RENDER CONFIG
```

### STEP 2: Deploy Backend

```
YOU                                GITHUB              RENDER
  │                                   │                   │
  1. Create account ─────────→ GitHub login ────────→ Render
  │
  2. Connect repo ──────────────────────────────→ Select SkillForge
  │
  3. Configure service
     ├─ Name: skillforge-backend
     ├─ Environment: Python 3
     ├─ Region: Oregon
     └─ Auto-deploy: Yes
  │
  4. Add environment var
     └─ GROQ_API_KEY = [your key]
  │
  5. Click "Create Web Service"
     │                              │ Receives webhook
     │                              ├─ Clones repo
     │                              ├─ pip install
     │                              ├─ Starts Flask
     │                              └─ ✅ Service live
  │
  SAVE: https://skillforge-backend.onrender.com
```

### STEP 3: Deploy Frontend

```
YOU                                GITHUB              VERCEL
  │                                   │                   │
  1. Create account ─────────→ GitHub login ────────→ Vercel
  │
  2. Import project ─────────────────────────→ Select SkillForge
  │
  3. Configure
     ├─ Framework: Next.js (auto)
     ├─ Root: frontend/
     └─ Build: npm run build
  │
  4. Add environment var
     └─ NEXT_PUBLIC_API_URL = [backend from Step 2]
     │
     │ ⚠️ CRITICAL: Use full URL from Render
  │
  5. Click "Deploy"
     │                              │ Receives webhook
     │                              ├─ npm install
     │                              ├─ next build
     │                              ├─ Optimize
     │                              └─ ✅ App live
  │
  SAVE: https://skillforge.vercel.app
```

### STEP 4: Verify (Test Everything)

```
Browser Tab 1: Backend Health Check
  │
  └─ https://skillforge-backend.onrender.com/api/health
     │
     ├─ Wait 2 seconds
     └─ See: {"status":"ok","model":"llama-3.3-70b-versatile"} ✅

Browser Tab 2: Frontend App
  │
  └─ https://skillforge.vercel.app
     │
     ├─ Page loads ✅
     ├─ Click "Try Sample" 
     │  └─ Data appears ✅
     ├─ Click "Analyze My Skills"
     │  └─ 60% match score appears ✅
     ├─ No errors in console ✅
     └─ Mobile view works ✅
```

---

## Data Flow During Analysis

```
USER SUBMITS ANALYSIS
         │
         ↓
    Browser (Vercel)
         │
    ├─ Reads form inputs
    ├─ Validates (min chars)
    └─ Makes HTTP POST request
         │
         ├─→ https://skillforge-backend.onrender.com/api/analyze
         │
         ↓
      Backend (Render)
         │
    ├─ Receives request
    ├─ Parses resume + job description
    ├─ Calls Groq API (with GROQ_API_KEY)
    │   │
    │   └─→ https://api.groq.com/...
    │       │
    │       ├─ Analyzes resume
    │       ├─ Analyzes job description
    │       ├─ Compares skills
    │       ├─ Calculates match score
    │       └─ Generates learning plan
    │
    ├─ Parses Groq response
    ├─ Formats JSON
    └─ Returns HTTP 200 + JSON
         │
         ↓
    Browser (Vercel)
         │
    ├─ Receives JSON
    ├─ Extracts data
    ├─ Renders components
    │  ├─ Match score circle (60%)
    │  ├─ Skill tags
    │  ├─ Learning plan
    │  └─ Radar chart
    └─ Display results ✅
```

---

## Environment Variables Flow

```
┌─────────────────────────────────────────┐
│        Configuration at Runtime         │
└─────────────────────────────────────────┘

RENDER (Backend)
├─ Environment → Variable → Name
│  └─ GROQ_API_KEY = gsk_...
│     │
│     └─→ app.py: groq_api_key = os.getenv("GROQ_API_KEY")
│         │
│         └─→ client = Groq(api_key=groq_api_key)
│             │
│             └─→ Used for every API call

VERCEL (Frontend)
├─ Environment → Name
│  └─ NEXT_PUBLIC_API_URL = https://skillforge-backend.onrender.com
│     │
│     └─→ page.tsx: const apiUrl = process.env.NEXT_PUBLIC_API_URL
│         │
│         └─→ fetch(`${apiUrl}/api/analyze`, {...})
│             │
│             └─→ Calls your Render backend
```

---

## Deployment Files Overview

```
SkillForge Repository
├── root/
│   ├─ render.yaml ─────────────→ Render config (build, start, env)
│   ├─ QUICK_DEPLOY.md ──────────→ 5-min reference (START HERE)
│   ├─ DEPLOYMENT_STEPS.md ─────→ Detailed walkthrough
│   ├─ DEPLOYMENT_CHECKLIST.md ─→ Full verification
│   ├─ DEPLOYMENT_GUIDE.md ─────→ Comprehensive reference
│   └─ DEPLOYMENT_SUMMARY.md ───→ This file
│
├── backend/
│   ├─ app.py ──────────────────→ Flask application + Groq integration
│   ├─ requirements.txt ────────→ Dependencies (gunicorn added)
│   └─ .env.example ────────────→ Environment template (GROQ_API_KEY)
│
└── frontend/
    ├─ package.json ───────────→ Dependencies + build scripts
    ├─ tsconfig.json ──────────→ TypeScript config (cleaned)
    ├─ vercel.json ────────────→ Vercel build config
    ├─ .env.example ───────────→ Environment template (NEXT_PUBLIC_API_URL)
    ├─ app/
    │  ├─ page.tsx ─────────────→ Main page + API integration
    │  └─ globals.css ──────────→ Global styles
    ├─ components/ ────────────→ React components (all styled)
    └─ tailwind.config.ts ─────→ Tailwind configuration
```

---

## Authentication Flow (No Login Required)

```
┌────────────────────────────────────────┐
│     SkillForge is Fully Public         │
│     (No Authentication Required)       │
└────────────────────────────────────────┘

USER
  │
  ├─ Visits vercel.com URL
  │  └─ No login needed ✓
  │
  ├─ Enters resume text or uploads PDF
  │  └─ No login needed ✓
  │
  ├─ Enters job description
  │  └─ No login needed ✓
  │
  ├─ Clicks "Analyze My Skills"
  │  └─ No login needed ✓
  │  └─ Backend validates input only
  │
  ├─ Gets results
  │  └─ No login needed ✓
  │
  └─ Result expires on page refresh ✓
     └─ Privacy: No data stored on server
```

---

## Error Handling & Recovery

```
IF SOMETHING FAILS
│
├─ Frontend Error
│  └─ Render error box in UI
│     ├─ Check backend URL in env vars
│     ├─ Test backend directly
│     └─ Redeploy frontend if needed
│
├─ Backend Error  
│  └─ Check Render logs
│     ├─ GROQ_API_KEY set?
│     ├─ Flask started?
│     └─ Manual deploy to restart
│
├─ Build Fails on Render
│  └─ Check build logs
│     ├─ pip install working?
│     ├─ gunicorn in requirements.txt?
│     └─ Git push to retry
│
├─ Build Fails on Vercel
│  └─ Check build logs
│     ├─ npm install working?
│     ├─ TypeScript errors?
│     └─ Git push to retry
│
└─ No Data After Analysis
   └─ Check browser console (F12)
      ├─ API call reaching backend?
      ├─ Response valid JSON?
      └─ Backend health check working?
```

---

## Post-Deployment Monitoring

```
DAILY CHECKS
│
├─ Render Dashboard
│  ├─ Service status: Live ✓
│  ├─ Last deploy: Recent
│  ├─ Logs: No errors
│  └─ Metrics: CPU low, Memory OK
│
├─ Vercel Dashboard
│  ├─ Deployment: Successful
│  ├─ Build time: Normal
│  ├─ Analytics: Traffic OK
│  └─ Errors: None
│
└─ Browser Testing
   ├─ Load frontend ✓
   ├─ Test sample ✓
   ├─ Run analysis ✓
   └─ Check console ✓
```

---

## Auto-Deploy Workflow

```
YOUR WORKFLOW
│
├─ Make changes locally
├─ Test locally (npm run dev)
├─ Commit: git add .
│         git commit -m "message"
├─ Push:  git push origin main
│
└─ GitHub Webhook Auto-Triggers
   │
   ├─ Render Receives Signal
   │  └─ Rebuilds backend (2-5 min)
   │     └─ ✅ Live automatically
   │
   ├─ Vercel Receives Signal
   │  └─ Rebuilds frontend (1-3 min)
   │     └─ ✅ Live automatically
   │
   └─ Both updated with zero downtime!
      └─ No manual deploy needed
```

---

## Performance Expectations

```
FIRST VISIT (First Load)
│
├─ Browser requests vercel.com URL
│  └─ Vercel responds with HTML (< 1s)
│
├─ Browser loads CSS + JavaScript
│  └─ Takes 1-2s
│
├─ React hydrates (Next.js)
│  └─ Page becomes interactive (< 2s)
│
└─ Total: ~2-3 seconds to interactive ✓

ANALYSIS REQUEST (After Submit)
│
├─ Browser POSTs to backend
│  └─ Network latency (< 0.5s)
│
├─ Backend receives request
│  └─ Validates input (< 0.1s)
│
├─ Backend calls Groq API
│  └─ LLM processes resume + job description (2-5s)
│
├─ Backend formats response
│  └─ Returns JSON (< 0.1s)
│
├─ Browser receives response
│  └─ Network latency (< 0.5s)
│
├─ React renders components
│  └─ Animations play (< 1s)
│
└─ Total: ~3-7 seconds from submit to results ✓

MOBILE (4G Network)
│
├─ Page load: 3-5 seconds
├─ Analysis: 5-10 seconds (network slower)
└─ ✓ Acceptable performance
```

---

## URLs Quick Reference

```
DEPLOYED SERVICES
├─ Frontend: https://skillforge.vercel.app
├─ Backend: https://skillforge-backend.onrender.com
├─ Backend Health: https://skillforge-backend.onrender.com/api/health
│
DASHBOARDS
├─ Render: https://dashboard.render.com
├─ Vercel: https://vercel.com
├─ GitHub: https://github.com/[your-org]/SkillForge
│
CONFIG & KEYS
├─ Groq API: https://console.groq.com/keys
├─ Groq Docs: https://console.groq.com/docs
│
DOCUMENTATION
├─ Quick Deploy: QUICK_DEPLOY.md
├─ Detailed Steps: DEPLOYMENT_STEPS.md
├─ Full Checklist: DEPLOYMENT_CHECKLIST.md
└─ Summary: DEPLOYMENT_SUMMARY.md
```

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│           SkillForge Application Stack              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FRONTEND (Vercel)                                  │
│  ├─ Next.js 14 (React framework)                   │
│  ├─ TypeScript (type-safe)                         │
│  ├─ Tailwind CSS (styling)                         │
│  ├─ Framer Motion (animations)                     │
│  ├─ Recharts (data visualization)                  │
│  └─ Responsive design (mobile + desktop)           │
│                                                     │
│  API INTEGRATION                                    │
│  ├─ REST API over HTTPS                            │
│  ├─ JSON request/response                          │
│  ├─ CORS enabled                                   │
│  └─ Environment variable for backend URL           │
│                                                     │
│  BACKEND (Render)                                   │
│  ├─ Flask (Python web framework)                   │
│  ├─ Gunicorn (production server)                   │
│  ├─ PyPDF2 (PDF parsing)                           │
│  ├─ Flask-CORS (cross-origin support)              │
│  └─ python-dotenv (env var management)             │
│                                                     │
│  AI INTEGRATION                                     │
│  ├─ Groq API (LLM provider)                        │
│  ├─ llama-3.3-70b-versatile (model)                │
│  ├─ Temperature 0.3 (deterministic)                │
│  └─ JSON response format                           │
│                                                     │
│  DEPLOYMENT                                         │
│  ├─ GitHub (source control)                        │
│  ├─ Render (backend hosting)                       │
│  ├─ Vercel (frontend hosting)                      │
│  └─ Auto-deploy on git push                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Success Checklist (Copy this!)

```
☐ Groq API key obtained
☐ Render backend deployed
☐ Vercel frontend deployed
☐ Backend URL in Vercel env vars
☐ Backend responds to health check
☐ Frontend loads without errors
☐ Sample data populates
☐ Analysis returns 60% match
☐ No console errors
☐ Mobile view responsive
☐ Ready to share with team!
```

---

**Last Updated**: 2026-06-11  
**Status**: ✅ Ready for Deployment  
**Time to Deploy**: 20-30 minutes  
**Complexity**: Low (guides provided)

---

**Next Step**: Open QUICK_DEPLOY.md for 5-minute deployment reference!
