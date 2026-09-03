# SentinelFlow AI — Enterprise Cyber Threat Intelligence & Forecasting Platform

SentinelFlow AI is a professional AI-powered cybersecurity threat intelligence, attack trajectory forecasting, explainability, and defense simulation platform engineered for Security Operations Centers (SOCs).

---

## 🛡️ Core Workflow

SentinelFlow AI unifies the end-to-end incident lifecycle:

**DETECT** ➔ **INVESTIGATE** ➔ **UNDERSTAND** ➔ **FORECAST** ➔ **EXPLAIN** ➔ **SIMULATE DEFENSE** ➔ **RECOMMEND ACTION**

---

## 🚀 Key Features

1. **Enterprise SOC Overview Dashboard (`/dashboard`)**:
   - 5 core KPI metric cards (Total Threats, Critical Risk, High Risk, Medium/Low, Monitored Systems).
   - Real-time 24-hour threat activity trend area chart.
   - Large visual risk score gauge (e.g. 87/100 HIGH RISK) with historical delta.
   - Visual 8-stage attack progression summary and top affected systems.
   - Next likely attack stage hero alert.

2. **Threats Management (`/threats`)**:
   - Filterable, searchable, and sortable threat register (Risk, Status, Stage, Type).
   - Realistic threat scenarios: *Credential Attack*, *Brute Force Login*, *Port Scanning*, *Suspicious Login*, *Malware Activity*, *Unusual Data Access*.

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
   - Real-time toggleable defensive countermeasures (*Block Source IP*, *Isolate Affected Host*, *Force Password Reset*, *Enable MFA*, *Increase Login Monitoring*).
   - Safe simulation sandbox with prominent governance boundaries.

8. **Prioritized Action Recommendations (`/recommendations`)**:
   - Action items organized by Critical, High, Medium, and Low urgency.
   - Detailed justification, target asset, expected risk reduction benefit, and simulation preview.

9. **Security Event Stream Console (`/events`)**:
   - SOC telemetry stream with live pause/resume toggle, keyword search, severity filters, and detailed payload inspector modal.

10. **Monitored Infrastructure (`/systems`)**:
    - Asset health inventory with host risk scores, active threat associations, and operating system metrics.

11. **Settings & Console Configuration (`/settings`)**:
    - Notification channels, alert thresholds, and interface preferences.

---

## 💻 Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS (Custom Enterprise High-Contrast Design System)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Layer**: Centralized typed React Context (`ThreatContext`)

---

## 🎨 Design System: Light Enterprise Security UI

- **Background**: Slate-50 (`#f8fafc`) / White surfaces
- **Primary Text**: Dark Charcoal Navy (`#0f172a`) — High contrast, zero washed-out pastel text
- **Secondary Text**: Medium Slate (`#475569`)
- **Semantic Risk Tokens**:
  - **Critical**: `#dc2626` (Red)
  - **High**: `#ea580c` (Orange)
  - **Medium**: `#d97706` (Amber)
  - **Low / Healthy**: `#16a34a` (Green)
  - **Primary Brand**: `#4f46e5` (Indigo)

---

## 🛠️ Installation & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📁 Architecture Documentation

- [`docs/UI_ARCHITECTURE.md`](./docs/UI_ARCHITECTURE.md): Complete UI layout, design tokens, and workflow specification.
- [`docs/DATA_ARCHITECTURE.md`](./docs/DATA_ARCHITECTURE.md): Centralized typed data schemas and state synchronization.
- [`docs/FUTURE_BACKEND_ARCHITECTURE.md`](./docs/FUTURE_BACKEND_ARCHITECTURE.md): Blueprint for integrating FastAPI, MongoDB, Kafka, and ML inference pipelines.

---

## ⚠️ Prototype Disclaimer

All What-if Simulator actions and recommendations are safe simulations for analytical planning. No real firewall modifications, IP blacklists, or endpoint isolations are executed against physical infrastructure.
