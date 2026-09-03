# SentinelFlow AI — Data & State Architecture

## 1. Centralized Mock Data Layer

All prototype telemetry, threats, monitored assets, AI forecasts, and defense simulations reside in a centralized, strongly typed data layer in `src/data/` and `src/types/index.ts`.

Components **never** hardcode inline mock data. They access all state through the typed `ThreatContext` provider or data service repository.

---

## 2. Core Entity Data Model

### A. Threat Entity (`Threat`)
```typescript
interface Threat {
  id: string;                          // e.g. 'THREAT-001'
  name: string;                        // e.g. 'Credential Attack'
  risk: RiskLevel;                     // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  riskScore: number;                   // 0 - 100 (e.g. 87)
  confidence: number;                  // 0 - 100 (e.g. 94)
  currentStage: string;                // 'Initial Access'
  currentStageId: AttackStageId;
  nextLikelyStage: string;             // 'Credential Access'
  nextLikelyProbability: number;       // 78%
  firstDetected: string;
  lastSeen: string;
  affectedSystem: string;              // 'DC-01'
  affectedSystemIp: string;            // '10.0.4.12'
  sourceIp: string;                    // '194.26.29.114'
  threatActor?: string;
  status: ThreatStatus;
  attackType: string;
  summary: string;
  stages: AttackStage[];               // 8-stage MITRE kill chain
  forecastTimeline: ForecastStage[];   // Probability + time windows
  contributingFactors: ContributingFactor[]; // Feature weights & evidence
  plainLanguageExplanation: string;
  simulatedActions: SimulatedAction[]; // What-if countermeasures
  recommendations: Recommendation[];   // Prioritized actions
  relatedEventIds: string[];
}
```

### B. Attack Progression Stage (`AttackStage`)
```typescript
interface AttackStage {
  id: AttackStageId;                   // 'reconnaissance' ... 'exfiltration'
  name: string;
  order: number;                       // 1 to 8
  status: AttackStageStatus;           // 'completed' | 'current' | 'predicted' | 'not-reached'
  timestamp?: string;
  confidence?: number;
  mitreTechniqueId?: string;          // e.g. 'T1078.002'
  mitreTechniqueName?: string;
  description: string;
  indicators: string[];                // Concrete IOCs
  relatedEventsCount: number;
}
```

### C. Simulated Defensive Action (`SimulatedAction`)
```typescript
interface SimulatedAction {
  id: string;
  name: string;
  description: string;
  category: 'Network' | 'Identity' | 'Host' | 'Policy';
  riskReductionPercent: number;        // e.g. 64%
  predictedRiskScore: number;          // e.g. 31
  impactAnalysis: string;
  recommendationText: string;
}
```

---

## 3. Global Context State (`ThreatContext.tsx`)

The application state manager coordinates:
- `selectedThreatId` & `selectedThreat`: Ensures active threat synchronization across all pages.
- `activeSimulatedActionIds`: Tracks selected countermeasures in the What-if sandbox.
- `simulatedRiskScore` & `simulatedRiskReductionPercent`: Real-time diminishing-returns calculation of residual risk.
- `searchQuery`: Global quick filter across threats, hosts, and events.
- `isLiveMonitoring`: Simulated real-time stream status.
- `metrics`: Aggregate enterprise threat counts and health posture.
