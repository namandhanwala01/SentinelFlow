export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ThreatStatus = 'Active' | 'Investigating' | 'Contained' | 'Resolved';

export type SystemHealthStatus = 'Healthy' | 'At Risk' | 'Critical';

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

export interface ContributingFactor {
  id: string;
  name: string;
  weight: number; // percentage (e.g., 31)
  evidence: string;
  category: 'Behavior' | 'Network' | 'Identity' | 'Device' | 'Access';
}

export interface ForecastStage {
  stageId: AttackStageId;
  stageName: string;
  probability: number; // e.g. 78
  timeWindow: string; // e.g. '10–20 min'
  keyIndicators: string[];
  mitreRef: string;
  confidenceInterval: string;
}

export interface SimulatedAction {
  id: string;
  name: string;
  description: string;
  category: 'Network' | 'Identity' | 'Host' | 'Policy';
  riskReductionPercent: number; // e.g. 64
  predictedRiskScore: number; // e.g. 31
  impactAnalysis: string;
  recommendationText: string;
}

export interface Recommendation {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  action: string;
  reason: string;
  affectedAsset: string;
  expectedBenefit: string;
  actionType: 'Containment' | 'Hardening' | 'Investigation' | 'Policy';
  suggestedTimeframe: string;
}

export interface Threat {
  id: string;
  name: string;
  risk: RiskLevel;
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
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

export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  sourceIp: string;
  destination: string;
  destinationIp?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  details: string;
  threatId?: string;
  category: 'Authentication' | 'Process Execution' | 'Network Connection' | 'File System' | 'Privilege';
}

export interface MonitoredSystem {
  id: string;
  name: string;
  type: 'Domain Controller' | 'Web Server' | 'File Server' | 'Workstation' | 'Mail Server' | 'Database Server';
  ipAddress: string;
  status: SystemHealthStatus;
  riskScore: number;
  lastSeen: string;
  activeThreatsCount: number;
  os: string;
  environment: 'Production' | 'Staging' | 'Corporate' | 'DMZ';
  department: string;
}

export interface MetricSummary {
  totalThreats: number;
  criticalRisk: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  systemsMonitored: number;
  overallRiskScore: number;
  riskScoreChange: number; // e.g. +4
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

