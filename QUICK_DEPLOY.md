# ⚡ SKILLFORGE QUICK DEPLOYMENT CARD

## 🔑 CREDENTIALS NEEDED

| Service | URL | What to Get |
|---------|-----|-----------|
| **Groq API** | https://console.groq.com/keys | API Key (starts with `gsk_`) |
| **Render** | https://render.com | Free account (GitHub login) |
| **Vercel** | https://vercel.com | Free account (GitHub login) |

---

## 🚀 DEPLOYMENT SEQUENCE

### STEP 1: Get Groq API Key (2 minutes)
```
1. Go to https://console.groq.com/keys
2. Create API Key if needed
3. Copy the key (gsk_...)
✅ Save for Render
```

### STEP 2: Deploy Backend on Render (5 minutes)
```
1. https://render.com → Sign up with GitHub
2. Dashboard → New + → Web Service
3. Select your SkillForge repository
4. Settings:
   - Name: skillforge-backend
   - Environment: Python 3
   - Build: pip install -r backend/requirements.txt
   - Start: gunicorn app:app --chdir backend --bind 0.0.0.0:$PORT
5. Environment Vars → Add:
   - GROQ_API_KEY = [your key from Step 1]
6. Create Web Service → Wait for deployment
✅ Copy backend URL (e.g., https://skillforge-backend.onrender.com)
```

### STEP 3: Deploy Frontend on Vercel (5 minutes)
```
1. https://vercel.com → Sign up with GitHub
2. New Project → Import your SkillForge repository
3. Settings:
   - Framework: Next.js (auto-detected)
   - Root Directory: frontend/
4. Environment Variables → Add:
   - NEXT_PUBLIC_API_URL = [backend URL from Step 2]
5. Deploy → Wait for deployment
✅ Copy frontend URL (e.g., https://skillforge.vercel.app)
```

### STEP 4: Test Everything (5 minutes)
```
1. Visit your frontend URL
2. Click "Try Sample"
3. Click "Analyze My Skills"
4. ✅ See 60% match score = SUCCESS!
```

---

## 🧪 QUICK TESTS

| Test | Expected Result | Status |
|------|-----------------|--------|
| Backend health | `{"status":"ok"}` | ✅ |
| Sample data | Resume text appears | ✅ |
| Analysis | 60% match, results show | ✅ |
| Mobile | Page responsive | ✅ |
| No errors | Console has no red errors | ✅ |

---

## 🐛 QUICK FIXES

| Error | Fix |
|-------|-----|
| "Failed to connect" | Backend URL wrong in Vercel env vars |
| Mock results (not real) | GROQ_API_KEY missing in Render |
| Blank page | Redeploy Vercel (Settings → Redeploy) |
| Slow first request | Free tier wakes up - wait 30 sec |
| Build failed | Check logs in Vercel/Render dashboards |

---

## 📋 COPY-PASTE COMMANDS

### Test Backend Locally
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

### Test Backend (Production)
```powershell
Invoke-WebRequest -Uri "https://skillforge-backend.onrender.com/api/health" -UseBasicParsing
```

### Frontend Build (verify locally)
```bash
cd frontend
npm run build
```

---

## 🎯 URLS TO SAVE

| Purpose | URL | Your Value |
|---------|-----|-----------|
| Backend | https://skillforge-backend.onrender.com | _______________ |
| Frontend | https://skillforge.vercel.app | _______________ |
| Render Logs | https://dashboard.render.com | _______________ |
| Vercel Logs | https://vercel.com | _______________ |
| Groq Console | https://console.groq.com/keys | _______________ |

---

## ⏱️ TIMELINE

```
Start Here
    ↓
[Get Groq Key] ← 2 min
    ↓
[Deploy Backend] ← 5 min (Render builds)
    ↓
[Deploy Frontend] ← 5 min (Vercel builds)
    ↓
[Test & Verify] ← 5 min
    ↓
🎉 LIVE!
```

**Total Time**: ~20 minutes

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] Groq API key obtained
- [ ] Backend requirements.txt has gunicorn
- [ ] vercel.json exists in frontend/
- [ ] render.yaml exists in root
- [ ] .env.example files created
- [ ] Git repo up to date
- [ ] No uncommitted changes
- [ ] Local tests pass

---

## 📱 VERIFICATION CHECKLIST

After deployment completes:

- [ ] Backend URL responds with health check
- [ ] Frontend URL loads without errors
- [ ] Sample button populates data
- [ ] Analysis returns 60% match score
- [ ] Skill tags display correctly
- [ ] Learning plan accordion works
- [ ] No console errors (F12)
- [ ] Mobile view responsive

---

## 🚨 EMERGENCY FIXES

### Backend not responding?
```
Render Dashboard → Service → Manual Deploy
```

### Frontend shows errors?
```
Vercel → Deployments → Redeploy
```

### API key issue?
```
Render → Settings → Environment → GROQ_API_KEY → Update
Then: Manual Deploy
```

---

## 🎓 DOCS LINKS

- Render: https://render.com/docs/native-runtimes
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs/deployment

---

**Status**: ✅ READY TO DEPLOY  
**Questions?** See DEPLOYMENT_STEPS.md for detailed guide
