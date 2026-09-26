# 🌿 KrishiDakshina (ಕೃಷಿದಕ್ಷಿಣ) / KRISISETU
> **Autonomous Agentic Farm Intelligence & Market Decision Ecosystem for Coastal Karnataka Smallholders**

---

## 📸 Screenshots & Architecture Parity

This project is built to precisely match the system architecture and UI mockups from the specification PDF:

1. **🌾 Public Landing Page (PDF Page 18 top & Page 23)**:
   - "Better decisions. Healthier farms." hero with live *Farm Pulse* card (0.76 NDVI, 68% rain chance, +4.2% market trend).
   - "From field signals to a clear next step" 3-tool launchpad (Spot disease early, See what your farm needs, Sell with confidence).
   - "Made for the coast" live statistics (3,500+ acres monitored, 7 taluks connected, 24/7 telemetry).

2. **🔐 Farmer Workspace Sign In (PDF Page 19 top)**:
   - Split-screen auth with farmer storytelling banner ("Your field has a story. Let's read it together.").
   - One-click *Demo farmer profile* button for Shivappa Gowda (Shrinivasa Farm, Puttur · 4.2 acres).

3. **📊 Farm Desk Overview (PDF Page 18 bottom)**:
   - Deep forest green sidebar navigation with live farm status indicator.
   - 4 Top KPI cards: Canopy Health (`0.76 NDVI`), Soil Moisture (`58%`), Rain in Next 24h (`68%`), Expected Harvest (`28.5 Q/acre`).
   - "START HERE" quick check action tiles & Microclimate field conditions card (`27° Light rain possible`).
   - Priority farm alert actions before rain arrives.

4. **🌱 Module 1: Crop Guide (Decision Support 01 - PDF Page 19 bottom)**:
   - Farm context inputs (Laterite soil, pH 5.8 slider, 4.2 acres, goal chips: Better income / Less water / Lower risk).
   - Top 3 shortlisted crops with match bars (*Arecanut + pepper* 94%, *Coconut + cocoa* 88%, *Paddy* 82%).
   - Interactive 4D TOPSIS radar breakdown (Soil Chemistry, Climate Match, NPK Affinity, Water Security).
   - Commercial fertilizer bag calculator (Urea 46% N, DAP 18:46:0, MOP 60% K in 50kg bags split across basal & top dressing).

5. **🍃 Module 2: Leaf Scan & Disease Vision (Decision Support 02 - PDF Page 20 top)**:
   - Daylight camera & photo dropzone with pre-loaded benchmark samples (*Arecanut Koleroga*, *Yellow leaf disease*, *Paddy blast*, *Early blight*).
   - 97.4% confidence rating and Disease Severity Index (DSI).
   - Interactive Grad-CAM Heatmap overlay with real-time opacity slider.
   - 3 Actionable prescription tabs: Chemical (*Bordeaux 1%*), Traditional (*"Kotte Kattuva"* areca bunch-tying), and Bio-fungicide (*Trichoderma*).
   - WhatsApp 4-day automated follow-up accountability loop toggle.
   - Longitudinal Crop Health Timeline (Day 0 vs Day 4 leaf comparison slider, ΔSeverity trajectory: IMPROVING).

6. **🌦️ Module 3: Risk Forecast & Weather (Decision Support 03 - PDF Page 20 bottom)**:
   - High risk window banner: *78% Koleroga fungal spore outbreak risk peaking on Thursday* (42 mm rain, 88% humidity).
   - Weather trend humidity chart with sustained leaf wetness danger threshold (>85%).
   - District Taluk risk view (*Puttur*, *Sullia*, *Belthangady*, *Bantwal*, *Mangaluru*).
   - 4 Agricultural Hazard Gauges (Fungal Blight, Heat Stress, Soil Moisture Deficit, Downpour & Hail Lodging).
   - Hourly Foliar Spraying Window Score & Smart Irrigation tube-well pump advice.

7. **🌿 Module 4: NDVI & Nutrients (Decision Support 04 - PDF Page 21)**:
   - Average NDVI `0.76 healthy` (↗ 6.4%), Healthy canopy `65%`.
   - Sentinel-2 multi-spectral parcel grid (Plot A) with interactive cell inspection and red target sensor pin.
   - Three zones breakdown: Vigorous canopy (65%), Moderate canopy (25%), and Potassium stress zone (10% - requires 25kg MOP).
   - CGWB groundwater table rating: *Safe (6.8m bgl)*.
   - Geodesic boundary acreage calculator.

8. **📈 Module 5: Yield Estimate (Decision Support 05 - PDF Page 22 top)**:
   - Dynamic season input sliders (Tree density 520, rainfall 3,120 mm, acreage 4.2).
   - Estimated yield `28.5 Q / acre` (↗ 8.2%) and projected return `₹4.1L`.
   - Five-season historical and projection trajectory chart (2020 to 2024 Kharif).

9. **💰 Module 6: Market Prices & Arbitrage (Decision Support 06 - PDF Page 22 bottom)**:
   - Top mover banner: *Tender coconut ₹34 / piece (+6.5%)*.
   - APMC rate board comparing Puttur, Mangaluru, Shivamogga, Sirsi, and Bantwal.
   - Arecanut Chali 90-day Temporal Fusion Transformer (TFT) price chart with ±95% confidence bounds.
   - "Hold vs. Sell" strategic horizon calculator factoring warehouse storage fees (₹35/qtl/mo) vs post-monsoon price surge.
   - Multi-mandi road freight & spatial arbitrage table.
   - Geo-Harvest Virtual Batch Pooling (4.8 tonne cluster with CAMPCO reverse auction).

10. **🛒 Seed Bazaar (Module 2 Architecture)**:
    - 5–50 km radius discovery for Raitha Samparka Kendras (RSK) and KVKs.
    - SATHI verified blue/white/green certification passports with 94% germination rate.
    - 50% DBT subsidy deduction via Karnataka FRUITS ID.
    - Cryptographic 48-hr offline QR Token pickup pass modal.

11. **🔬 AIoT & Edge Hardware Lab**:
    - Live dual-depth soil sensor telemetry (15cm shallow & 30cm deep).
    - 12V DC latching solenoid drip valve relay controls (Closed-loop auto vs manual override).
    - Automatic rain-delay suppression lockout.
    - LoRaWAN IN865 gateway RSSI and SNR telemetry.

12. **🤖 Kisan Mitra Agentic Voice Copilot**:
    - Zero-typing voice assistant with animated audio waveform and vernacular speech synthesis.
    - Visible "Glass-Box" reasoning trace displaying live ReAct tool calls (`recommend_crops`, `get_market_forecast`, `calculate_mandi_arbitrage`, `generate_agro_forecast`, `check_seed_bank_stock`, `diagnose_crop_disease`, `calculate_fertilizer_schedule`).
    - One-tap quick prompt chips.

13. **🌓 Dark Mode & Light Mode**:
    - Instant theme toggle in top bar and landing page with high-contrast outdoor readability.

14. **🌐 Multi-Dialect Language Switcher**:
    - Support for **Kannada (ಕನ್ನಡ - Default)**, **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.

---

## 🚀 Running the Project

### Frontend Web (Next.js 14 App Router)
```bash
cd apps/web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

To verify or run the production build:
```bash
npm run build
npm start
```

### Python FastAPI Backend
```bash
cd apps/api
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Install packages:
pip install -r requirements.txt
# Run FastAPI:
uvicorn app.main:app --reload --port 8000
```
API Documentation will be accessible at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🌐 Cloud & Production Deployment

For complete, step-by-step instructions on deploying KRISISETU, see [DEPLOYMENT.md](DEPLOYMENT.md).

### 1-Click Docker Stack (VPS / Local)
```bash
docker compose up --build -d
```
- **Web Portal:** `http://localhost:3000`
- **FastAPI Backend:** `http://localhost:8000/docs`

### Cloud Hosting (Free Tier)
- **Frontend (Next.js):** [Vercel](https://vercel.com) (Root Directory: `apps/web`, Environment Variable: `NEXT_PUBLIC_API_URL=<your-api-url>/api/v1`)
- **Backend (FastAPI):** [Render](https://render.com) (Web Service, Root Directory: `apps/api`, Build Command: `pip install -r requirements.txt && python seed_db.py && python seed_admin.py`, Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`)
- **1-Click Render Blueprint:** Use the included `render.yaml` to deploy both services simultaneously.
