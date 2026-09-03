# SentinelFlow AI — UI & UX Architecture

## 1. Design Philosophy: Light Enterprise Security UI

SentinelFlow AI is engineered specifically for Security Operations Centers (SOCs), incident response teams, and threat intelligence analysts. It departs decisively from dark "hacker movie" tropes, neon glowing borders, and unreadable low-contrast dashboards.

### Core Visual Tenets:
- **Clean Enterprise Foundation**: Crisp light background (`#f8fafc`), clean white modular cards (`#ffffff`), and slate border frames (`#e2e8f0`).
- **High Readability**: Dark charcoal headings (`#0f172a`) and slate body text (`#475569`). Zero washed-out or pastel text on light surfaces.
- **Consistent Semantic Color Coding**:
  - **Critical**: `#dc2626` (Red) — `bg-red-50`, `border-red-300`, `text-red-700`
  - **High**: `#ea580c` (Orange) — `bg-orange-50`, `border-orange-300`, `text-orange-800`
  - **Medium**: `#d97706` (Amber) — `bg-amber-50`, `border-amber-300`, `text-amber-800`
  - **Low / Healthy**: `#16a34a` (Green) — `bg-emerald-50`, `border-emerald-300`, `text-emerald-800`
  - **Primary Brand Accent**: `#4f46e5` (Indigo)
- **Accessible Contrast Ratios**: Full WCAG AA/AAA compliance across all tabular data, charts, metrics, and interactive controls.

---

## 2. Global Workflow Architecture

The interface mirrors the end-to-end cybersecurity decision loop:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     DETECT      │ ───►  │   INVESTIGATE   │ ───►  │   UNDERSTAND    │
│  (/dashboard)   │       │   (/threats/:id)│       │(/attack-intel)  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ RECOMMEND ACTION│ ◄───  │ SIMULATE DEFENSE│ ◄───  │    FORECAST     │
│(/recommendations│       │    (/what-if)   │       │   (/forecast)   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **DETECT**: The SOC Dashboard immediately alerts the analyst to active threats, fleet health, and baseline risk.
2. **INVESTIGATE**: Threat Details surfaces the IOCs, source origin, targeted assets, and timeline.
3. **UNDERSTAND**: Attack Intelligence plots the threat against the 8-stage MITRE ATT&CK kill chain.
4. **FORECAST**: Predictive engine identifies the next likely attack stage and anticipated time window.
5. **EXPLAIN**: Plain-language AI explainability provides feature importance without ML jargon.
6. **SIMULATE DEFENSE (Hero Sandbox)**: What-if simulator enables risk-free countermeasure modeling.
7. **RECOMMEND ACTION**: Prioritized action dossier with operational timelines and governance notices.

---

## 3. Component Hierarchy & Reusability

```
src/
├── components/
│   ├── common/
│   │   ├── Badge.tsx               # Semantic status and severity tags
│   │   ├── Button.tsx              # Standard, outline, ghost, loading buttons
│   │   ├── Card.tsx                # Modular surface with header and action slots
│   │   ├── MetricCard.tsx          # Top KPI cards with trend lines
│   │   ├── PageHeader.tsx          # Page title, breadcrumbs, action bar
│   │   ├── RiskGauge.tsx           # Scalable SVG arc risk meter (0-100)
│   │   ├── SimulationBanner.tsx    # Safe simulation notice banner
│   │   └── ThreatSelectorDropdown  # Global active threat switcher
│   ├── layout/
│   │   ├── AppShell.tsx            # Global application layout wrapper
│   │   ├── Sidebar.tsx             # Collapsible navigation drawer
│   │   └── TopHeader.tsx           # Search, notifications, and telemetry status
│   ├── charts/
│   │   └── ThreatTrendChart.tsx    # 24-hour threat volume area chart
│   ├── attack/
│   │   ├── AttackChainVisualizer   # 8-stage MITRE progression timeline
│   │   └── StageDetailCard.tsx     # Stage IOC and technique inspector
│   ├── simulation/
│   │   └── WhatIfSimulatorWidget   # Interactive dual-gauge countermeasure sandbox
│   ├── explainability/
│   │   ├── AnalystSummaryCard.tsx  # Executive natural language explanation
│   │   └── ContributingFactorsList # Horizontal feature importance weight bars
│   ├── threats/
│   │   ├── ThreatTable.tsx         # Sortable, searchable threat register
│   │   └── ThreatSummaryHero.tsx   # Threat header with key metadata
│   ├── events/
│   │   └── EventStreamTable.tsx    # SOC live telemetry console with filters
│   └── systems/
│       └── SystemsTable.tsx        # Asset health and risk score table
```
