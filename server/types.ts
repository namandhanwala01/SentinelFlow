export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ThreatStatus = 'Active' | 'Investigating' | 'Contained' | 'Resolved';
export type AttackStageId =
  | 'reconnaissance'
  | 'initial-access'
  | 'execution'
  | 'persistence'
  | 'privilege-escalation'
  | 'credential-access'
  | 'lateral-movement'
  | 'exfiltration';

export type AttackStageStatus = 'completed' | 'current' | 'predicted' | 'not-reached';

export interface AttackStage {
  id: AttackStageId;
  name: string;
  order: number;
  status: AttackStageStatus;
  timestamp?: string;
  confidence?: number;
  mitreTechniqueId?: string;
  mitreTechniqueName?: string;
  description: string;
  indicators: string[];
  relatedEventsCount: number;
}

export interface ForecastStage {
  stageId: AttackStageId;
  stageName: string;
  probability: number;
  estimatedTimeWindow: string;
  indicators: string[];
  confidence: number;
  recommendedPreemptiveAction: string;
}

export interface ContributingFactor {
  id: string;
  name: string;
  category: 'Behavioral Anomaly' | 'Identity Risk' | 'Network Pattern' | 'Endpoint Telemetry' | 'Threat Intelligence';
  weight: number;
  description: string;
  evidence: string;
}

export interface SimulatedAction {
  id: string;
  name: string;
  description: string;
  category: 'Network' | 'Identity' | 'Host' | 'Policy';
  riskReductionPercent: number;
  predictedRiskScore: number;
  impactAnalysis: string;
  recommendationText: string;
}

export interface Recommendation {
  id: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  reason: string;
  affectedAsset: string;
  expectedBenefit: string;
  actionCategory: 'Firewall' | 'IAM' | 'EDR' | 'Patching' | 'Monitoring';
  simulatedReduction: number;
}

export interface Threat {
  id: string;
  name: string;
  risk: RiskLevel;
  riskScore: number;
  confidence: number;
  currentStage: string;
  currentStageId: AttackStageId;
  nextLikelyStage: string;
  nextLikelyProbability: number;
  firstDetected: string;
  lastSeen: string;
  affectedSystem: string;
  affectedSystemIp: string;
  sourceIp: string;
  threatActor?: string;
  status: ThreatStatus;
  attackType: string;
  summary: string;
  stages: AttackStage[];
  forecastTimeline: ForecastStage[];
  contributingFactors: ContributingFactor[];
  plainLanguageExplanation: string;
  simulatedActions: SimulatedAction[];
  recommendations: Recommendation[];
  relatedEventIds: string[];
}

export interface MonitoredSystem {
  id: string;
  name: string;
  ip: string;
  type: 'Domain Controller' | 'Database Server' | 'Workstation' | 'Web Server' | 'File Server' | 'Cloud Gateway';
  os: string;
  status: 'Healthy' | 'At Risk' | 'Critical';
  riskScore: number;
  activeThreatsCount: number;
  lastSeen: string;
  assignedThreatId?: string;
  agentVersion: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  sourceIp: string;
  destination: string;
  destinationIp?: string;
  severity: RiskLevel | 'INFO';
  category: string;
  details: string;
  threatId?: string;
  rawPayload?: Record<string, any>;
}

export interface MetricSummary {
  totalThreats: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  systemsMonitored: number;
  overallRiskScore: number;
  riskScoreChange: number;
}

export interface SimulationRequest {
  threatId?: string;
  baseRiskScore?: number;
  actionIds: string[];
}

export interface SimulationResponse {
  baselineRiskScore: number;
  projectedRiskScore: number;
  totalRiskReductionPercent: number;
  appliedActions: SimulatedAction[];
  isSimulationOnly: boolean;
  disclaimer: string;
  analysis: string;
}
