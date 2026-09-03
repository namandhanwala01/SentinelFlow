# SentinelFlow AI — Future Backend & ML Architecture

## 1. High-Level System Architecture

SentinelFlow AI frontend prototype is designed for drop-in backend connectivity without rewriting visual components or changing user workflows.

```
┌─────────────────────────────────────────────────────────┐
│              SENTINELFLOW REACT FRONTEND                │
│         (Vite + TypeScript + Tailwind CSS)              │
└───────────────────────────┬─────────────────────────────┘
                            │ REST / WebSocket / GraphQL
                            ▼
┌─────────────────────────────────────────────────────────┐
│               FASTAPI / NODE.JS BACKEND                 │
│   - Authentication (JWT / OAuth2 / SSO)                 │
│   - Telemetry Ingestion Pipeline (Kafka / RabbitMQ)     │
│   - Threat Correlation Engine & Policy Manager          │
└─────────────┬─────────────────────────────┬─────────────┘
              │                             │
              ▼                             ▼
┌──────────────────────────┐   ┌──────────────────────────┐
│       AI / ML ENGINE     │   │      DATA PERSISTENCE    │
│  - Sequence Prediction   │   │  - MongoDB (Threats/IOC) │
│    (LSTM / Transformer)  │   │  - TimescaleDB (Events)  │
│  - Markov Graph Modeler  │   │  - Redis (Live Sessions) │
│  - SHAP Explainability   │   └──────────────────────────┘
└──────────────────────────┘
```

---

## 2. API Endpoint Specification (Future Target)

### Threats & Incident Management
- `GET /api/v1/threats` — Query active threat register with filter params (`risk`, `status`, `stage`).
- `GET /api/v1/threats/{threat_id}` — Get single threat object with 8-stage kill chain and contributing factors.
- `POST /api/v1/threats/{threat_id}/status` — Update lifecycle state (`Active`, `Investigating`, `Contained`).

### Predictive Forecasting & Explainability
- `GET /api/v1/threats/{threat_id}/forecast` — Trigger live inference for next likely stage and time windows.
- `GET /api/v1/threats/{threat_id}/explainability` — Retrieve SHAP feature weights and plain-language summary.

### What-if Simulation Engine
- `POST /api/v1/simulate` — Submit selected countermeasure IDs, returns calculated residual risk and impact trajectory.

### Real-Time Event Stream
- `WS /api/v1/events/stream` — WebSocket feed delivering parsed syslog, EDR, and network flow alerts.

---

## 3. Machine Learning Models & Data Pipelines

1. **Attack Progression Forecasting Model**:
   - Model: Multi-stage Directed Graph Neural Network (GNN) / Transformer trained on MITRE ATT&CK enterprise datasets.
   - Input: Sequence of observed security events $[e_1, e_2, \dots, e_t]$ with categorical metadata (MITRE Technique, host criticality, time delta).
   - Output: Probability distribution over all subsequent stages $\hat{P}(S_{t+1} = k)$ and time-to-compromise estimate $\Delta t$.

2. **Explainability Layer (XAI)**:
   - Kernel SHAP / TreeSHAP applied to tabular anomaly features (failed login burst, impossible travel, JA4 fingerprint deviation).
   - Natural language generation (NLG) template engine transforming high-weight features into clear SOC analyst prose.
