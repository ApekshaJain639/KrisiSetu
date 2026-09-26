# 🚀 KRISISETU (ಕೃಷಿಸೇತು) — Deployment Guide

This guide provides simple, step-by-step instructions to deploy **KRISISETU** to production for free, or onto any cloud server / VPS.

---

## 📋 Architecture Overview

| Component | Technology | Recommended Host | Free Tier Available? |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | Next.js 14 (React 18 + Tailwind) | [Vercel](https://vercel.com) or [Render](https://render.com) | ✅ Yes (100% Free) |
| **Backend API** | FastAPI + Python 3.11 + Uvicorn | [Render](https://render.com) or [Railway](https://railway.app) | ✅ Yes (100% Free) |
| **Database** | SQLite (Default) or PostgreSQL | Built-in SQLite or Supabase / Neon / Render Postgres | ✅ Yes (100% Free) |

---

## 🌟 Method 1: Vercel (Frontend) + Render (Backend) [Recommended]

This is the fastest, cleanest, and most reliable setup. Both platforms offer generous free tiers.

### Step 1: Deploy Backend to Render (5 minutes)

1. Sign up / Log in to [Render.com](https://render.com).
2. On your dashboard, click **"New +"** and choose **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and select or paste your GitHub repo:
   `https://github.com/ApekshaJain639/KrisiSetu.git`
4. Configure the service settings:
   - **Name:** `krisisetu-api`
   - **Region:** Any (e.g. `Singapore` or `Oregon`)
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `apps/api`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt && python seed_db.py && python seed_admin.py
     ```
   - **Start Command:**
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type:** `Free`
5. *(Optional)* Add Environment Variables in Render:
   - `PYTHON_VERSION`: `3.11.9`
   - `GEMINI_API_KEY`: *(Your Google AI Gemini key)*
   - `SARVAM_API_KEY`: *(Your Sarvam AI Kannada Voice key)*
6. Click **"Deploy Web Service"**.
7. Once deployed, copy your API URL (e.g., `https://krisisetu-api.onrender.com`).
   - You can test it in your browser: `https://krisisetu-api.onrender.com/docs`

---

### Step 2: Deploy Frontend to Vercel (3 minutes)

1. Sign up / Log in to [Vercel.com](https://vercel.com).
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your GitHub repository: `https://github.com/ApekshaJain639/KrisiSetu.git`.
4. In the configuration screen:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select `apps/web`.
5. Expand **Environment Variables** and add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://your-backend-service.onrender.com/api/v1` *(Replace with your Render API URL from Step 1)*
   - *(Optional)* **Key:** `NEXT_PUBLIC_SARVAM_API_KEY`
   - *(Optional)* **Value:** *(Your Sarvam key for Kannada voice)*
6. Click **"Deploy"**.
7. In ~60 seconds, your application will be live at `https://your-project.vercel.app`! 🎉

---

## 📦 Method 2: Render 1-Click Blueprint (`render.yaml`)

We have pre-configured a `render.yaml` file in the root of the repository for automatic provisioning.

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **"New +"** ➔ **"Blueprint"**.
3. Connect `https://github.com/ApekshaJain639/KrisiSetu.git`.
4. Render will read `render.yaml` and automatically configure both:
   - `krisisetu-api` (FastAPI backend service)
   - `krisisetu-web` (Next.js frontend service connected to the API)
5. Click **"Apply"** and let both build.

---

## 🐳 Method 3: Single-Command Docker Deployment (VPS / Cloud / Local)

Deploy to any Linux VPS (AWS EC2, DigitalOcean, Hetzner, Linode) or local Docker with Docker Compose:

```bash
# 1. Clone repository
git clone https://github.com/ApekshaJain639/KrisiSetu.git
cd KrisiSetu

# 2. Build and launch all containers
docker compose up --build -d
```

### Endpoints:
- **Web App Portal:** `http://<your-server-ip>:3000`
- **FastAPI Documentation:** `http://<your-server-ip>:8000/docs`
- **PostgreSQL / PostGIS:** `localhost:5432`

To view logs:
```bash
docker compose logs -f
```

To stop:
```bash
docker compose down
```

---

## 🔐 Default Access Credentials

Once deployed, the database is auto-seeded with test accounts:

### 1. Farmer Desk (ಕೃಷಿಕರ ಮುಖಪುಟ)
- **Mobile Number:** `9876543210`
- **Password:** `demo`
- **Identity:** Shivappa Gowda (Puttur, Dakshina Kannada)

### 2. Admin & Regulatory Console (SDM / DHO)
- **Super Administrator:**
  - **Username:** `admin`
  - **Password:** `admin123`
  - **Role:** `sdm_admin` (Full State Oversight)
- **District Horticulture Officer (Puttur):**
  - **Username:** `dho_puttur`
  - **Password:** `puttur@2026`
  - **Role:** `district_officer`

> **Note on Security:** Farmers are strictly restricted from the Admin Console via cryptographic HTTP 403 API guards and UI route protection. Administrators have dual access to both the Admin Console and Farmer Desk.

---

## ⚙️ Environment Variables Summary

| Variable | Target Service | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend (`apps/web`) | Full URL to the API endpoint (e.g. `https://api.example.com/api/v1`) |
| `NEXT_PUBLIC_SARVAM_API_KEY` | Frontend (`apps/web`) | *(Optional)* High-precision Kannada speech recognition & TTS |
| `GEMINI_API_KEY` | Backend (`apps/api`) | Multimodal Crop Disease AI & Agronomic Advisory |
| `DATAGOV_API_KEY` | Backend (`apps/api`) | *(Optional)* Direct eNAM & Agmarknet Government API gateway |
| `DATABASE_URL` | Backend (`apps/api`) | *(Optional)* Custom PostgreSQL connection string (defaults to SQLite) |
