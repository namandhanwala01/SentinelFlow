# SentinelFlow AI — Enterprise Cyber Threat Intelligence & Forecasting Platform

SentinelFlow AI is a professional AI-powered cybersecurity threat intelligence, attack trajectory forecasting, explainability, and defense simulation platform engineered for Security Operations Centers (SOCs).

---

## 🛡️ Core Workflow

SentinelFlow AI unifies the end-to-end incident lifecycle:

```
[ DETECT ] ➔ [ INVESTIGATE ] ➔ [ UNDERSTAND ] ➔ [ FORECAST ] ➔ [ EXPLAIN ] ➔ [ SIMULATE DEFENSE ] ➔ [ RECOMMEND ACTION ]
```

---

## 🚀 Key Platform Features

1. **Enterprise SOC Overview Dashboard (`/dashboard`)**:
   - 5 core KPI metric cards (Total Threats, Critical Risk, High Risk, Medium/Low, Monitored Systems).
   - Real-time 24-hour threat activity trend area chart.
   - Large visual risk score gauge (e.g. 87/100 HIGH RISK) with historical delta.
   - Visual 8-stage attack progression summary and top affected systems.
   - Next likely attack stage hero alert.

2. **Threats Management (`/threats`)**:
   - Filterable, searchable, and sortable threat register (Risk, Status, Stage, Type).
   - Realistic threat vectors: *Credential Attack*, *Brute Force Login*, *Port Scanning*, *Suspicious Login*, *Privilege Escalation*, *Lateral Movement*, *Data Exfiltration*.

3. **Threat Investigation & Deep Dive (`/threats/:id`)**:
   - Complete metadata header: risk score, AI confidence, target host, source IP, current stage, timeline.
   - 6 synchronized analytical tabs: Overview, Attack Progression, AI Forecast, Explainability, What-if Simulator, Recommendations.

4. **Attack Intelligence & Kill Chain (`/attack-intelligence`)**:
   - Interactive 8-stage MITRE ATT&CK visualization (Reconnaissance, Initial Access, Execution, Persistence, Privilege Escalation, Credential Access, Lateral Movement, Exfiltration).
   - Inspect stage-by-stage indicators of compromise (IOCs), timestamps, and confidence scores.

5. **AI Attack Forecasting (`/forecast`)**:
   - Next Likely Stage hero card with probability metrics (e.g., Credential Access 78%).
   - Escalation timeline windows (10–20 min, 30–60 min, 1–2 hrs, 2–6 hrs) for proactive defense planning.

6. **Explainability Engine (`/explainability`)**:
   - "Why did SentinelFlow flag this threat?"
   - Horizontal feature importance weight bars and grounded evidence snippets.
   - Natural language executive summaries tailored for security analysts without ML buzzwords.

7. **Hero Feature: What-if Defense Simulator (`/what-if`)**:
   - Interactive dual-gauge comparison modeling baseline risk vs projected post-containment risk.
   - Real-time toggleable defensive countermeasures (*Block Source IP*, *Isolate Affected Host*, *Force Password Reset*, *Enable MFA*, *Block Lateral SMB*).
   - Multi-action diminishing-returns residual risk calculation.
   - Safe simulation sandbox with prominent governance boundaries.

8. **Prioritized Action Recommendations (`/recommendations`)**:
   - Action items organized by Critical, High, Medium, and Low urgency.
   - Detailed justification, target asset, expected risk reduction benefit, and simulation preview.

9. **Security Event Stream Console (`/events`)**:
   - SOC telemetry stream with live pause/resume toggle, keyword search, severity filters, and detailed payload inspector modal.
   - Integrated **Attack Scenario Injector** supporting all 8 realistic MITRE attack scenarios and custom JSON telemetry ingestion.

10. **Monitored Infrastructure (`/systems`)**:
    - Asset health inventory with host risk scores, active threat associations, OS metrics, environment classification, and agent health.

11. **Settings & Console Configuration (`/settings`)**:
    - Notification channels, alert thresholds, and interface preferences.

---

## 🧠 AI / ML Service Pipeline

```
Security Telemetry (SIEM/Syslog/EDR/IDS/Simulator)
       ↓
1. Normalization (Schema alignment, JA4, geo-tagging, host mapping)
       ↓
2. Feature Extraction (Burst rate, ASN reputation, privilege elevation flags, off-hours)
       ↓
3. Threat Detection & Risk Scoring (Risk 0-100, AI confidence, threat attribution)
       ↓
4. MITRE ATT&CK Stage Identification (8 kill-chain milestones)
       ↓
5. Markov-Transformer Attack Progression Forecasting (Next likely stage & time windows)
       ↓
6. Explainability Engine (XAI feature importance weights & analyst narrative)
       ↓
7. What-If Defense Sandbox (Countermeasure modeling with diminishing returns)
       ↓
8. Action Recommendations (Prioritized containment and hardening dossier)
```

---

## 💻 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, React Router v7
- **Backend**: Node.js, Express 5, TypeScript (`tsx`), CORS, Dotenv
- **Database Layer**: MongoDB Atlas / Mongoose (with High-Performance In-Memory store fallback)
- **Validation & Tooling**: TypeScript ~6.0, Oxlint, Vite 8

---

## 🛠️ Local Installation & Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Full-Stack Concurrently (Frontend + Backend)
```bash
npm run dev:all
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

### 4. Run Automated Backend Test Suite
```bash
npm run test:server
```

### 5. Build for Production
```bash
npm run build
```

---

## 🍃 MongoDB Atlas Setup Sequence

SentinelFlow AI is engineered to connect to **MongoDB Atlas Cloud Cluster** as its primary persistent database, while including a seamless in-memory fallback store if Atlas credentials are not yet supplied in the local environment.

To connect your own MongoDB Atlas instance:
1. Create a free **M0 Cluster** at [MongoDB Atlas](https://cloud.mongodb.com/).
2. Under **Database Access**, create a database user with Read/Write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (or your static IP address).
4. Go to **Database** ➔ **Connect** ➔ **Drivers** ➔ **Node.js** and copy your connection string.
5. In your `.env` file, set:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/sentinelflow?retryWrites=true&w=majority
   ```
6. Start the backend: `npm run server`. Data will automatically seed into your Atlas cluster on first startup.

---

## 🚀 Production Deployment Guide

### Frontend ➔ Vercel
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: Your deployed Render API URL (e.g. `https://sentinelflow-api.onrender.com/api/v1`)
- SPA routing rewrite rule is pre-configured in [`vercel.json`](./vercel.json).

### Backend ➔ Render
- Environment: Node
- Build command: `npm install`
- Start command: `npm run server`
- Environment Variables:
  - `NODE_ENV`: `production`
  - `PORT`: `5000`
  - `MONGODB_URI`: `mongodb+srv://<username>:<password>@...`
  - `CORS_ORIGIN`: Your Vercel frontend URL (e.g. `https://sentinelflow.vercel.app`)
- Blueprint is pre-configured in [`render.yaml`](./render.yaml).

---

## ⚠️ Prototype Disclaimer

All What-if Simulator actions and recommendations are safe simulations for analytical planning. No real firewall modifications, IP blacklists, or endpoint isolations are executed against physical infrastructure without human SOC approval.
