import {
  Threat,
  MonitoredSystem,
  SecurityEvent,
  MetricSummary,
  SimulationResponse,
  ThreatStatus,
} from '../types';
import { mockThreats, mockSystems, mockEvents } from '../data';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) errorMessage = parsed.message;
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export interface ScenarioInfo {
  type: string;
  name: string;
  category: string;
  description: string;
}

export const SentinelFlowAPI = {
  /**
   * Healthcheck & Backend Connectivity
   */
  async getHealth(): Promise<{ status: string; service: string; version: string }> {
    try {
      return await fetchJson<{ status: string; service: string; version: string }>('/health');
    } catch (err) {
      console.warn('[SentinelFlowAPI] Healthcheck failed:', err);
      throw err;
    }
  },

  /**
   * Metrics Summary
   */
  async getMetrics(): Promise<MetricSummary> {
    try {
      const res = await fetchJson<{ success: boolean; data: MetricSummary }>('/threats/metrics');
      return res.data;
    } catch (err) {
      console.warn('[SentinelFlowAPI] Fetch metrics fallback to local calculation:', err);
      const critical = mockThreats.filter((t) => t.risk === 'CRITICAL').length;
      const high = mockThreats.filter((t) => t.risk === 'HIGH').length;
      const medium = mockThreats.filter((t) => t.risk === 'MEDIUM').length;
      const low = mockThreats.filter((t) => t.risk === 'LOW').length;
      return {
        totalThreats: mockThreats.length,
        criticalRisk: critical,
        highRisk: high,
        mediumRisk: medium,
        lowRisk: low,
        systemsMonitored: mockSystems.length,
        overallRiskScore: 87,
        riskScoreChange: 4,
      };
    }
  },

  /**
   * Threat Management APIs
   */
  async getThreats(filters?: {
    risk?: string;
    status?: string;
    stage?: string;
    search?: string;
  }): Promise<Threat[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.risk && filters.risk !== 'ALL') queryParams.append('risk', filters.risk);
      if (filters?.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
      if (filters?.stage && filters.stage !== 'ALL') queryParams.append('stage', filters.stage);
      if (filters?.search) queryParams.append('search', filters.search);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const res = await fetchJson<{ success: boolean; data: Threat[] }>(`/threats${qs}`);
      return res.data;
    } catch (err) {
      console.warn('[SentinelFlowAPI] Fetch threats fallback to local mock store:', err);
      return mockThreats;
    }
  },

  async getThreatById(id: string): Promise<Threat | null> {
    try {
      const res = await fetchJson<{ success: boolean; data: Threat }>(`/threats/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`[SentinelFlowAPI] Fetch threat ${id} fallback:`, err);
      return mockThreats.find((t) => t.id === id) || null;
    }
  },

  async updateThreatStatus(id: string, status: ThreatStatus): Promise<Threat | null> {
    try {
      const res = await fetchJson<{ success: boolean; data: Threat }>(`/threats/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return res.data;
    } catch (err) {
      console.warn(`[SentinelFlowAPI] Update status fallback for ${id}:`, err);
      const threat = mockThreats.find((t) => t.id === id);
      if (threat) threat.status = status;
      return threat || null;
    }
  },

  /**
   * Security Telemetry & Events APIs
   */
  async getEvents(filters?: {
    severity?: string;
    category?: string;
    search?: string;
    threatId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ events: SecurityEvent[]; total: number; page: number; totalPages: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.severity && filters.severity !== 'ALL') queryParams.append('severity', filters.severity);
      if (filters?.category && filters.category !== 'ALL') queryParams.append('category', filters.category);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.threatId) queryParams.append('threatId', filters.threatId);
      if (filters?.page) queryParams.append('page', filters.page.toString());
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const res = await fetchJson<{
        success: boolean;
        events: SecurityEvent[];
        total: number;
        page: number;
        totalPages: number;
      }>(`/events${qs}`);
      return {
        events: res.events,
        total: res.total,
        page: res.page,
        totalPages: res.totalPages,
      };
    } catch (err) {
      console.warn('[SentinelFlowAPI] Fetch events fallback to mock store:', err);
      return {
        events: mockEvents,
        total: mockEvents.length,
        page: 1,
        totalPages: 1,
      };
    }
  },

  async ingestRawEvent(rawEvent: Record<string, any>): Promise<{
    success: boolean;
    data: SecurityEvent;
    threatDetected: boolean;
    threat?: Threat;
    analysis?: string;
  }> {
    return await fetchJson('/events/ingest', {
      method: 'POST',
      body: JSON.stringify(rawEvent),
    });
  },

  /**
   * Systems Inventory APIs
   */
  async getSystems(filters?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<MonitoredSystem[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status && filters.status !== 'ALL') queryParams.append('status', filters.status);
      if (filters?.type && filters.type !== 'ALL') queryParams.append('type', filters.type);
      if (filters?.search) queryParams.append('search', filters.search);

      const qs = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const res = await fetchJson<{ success: boolean; data: MonitoredSystem[] }>(`/systems${qs}`);
      return res.data;
    } catch (err) {
      console.warn('[SentinelFlowAPI] Fetch systems fallback:', err);
      return mockSystems;
    }
  },

  /**
   * AI Attack Forecasting APIs
   */
  async getForecast(threatId: string): Promise<any> {
    try {
      return await fetchJson(`/forecast/${threatId}`);
    } catch (err) {
      console.warn(`[SentinelFlowAPI] Forecast fetch fallback for ${threatId}:`, err);
      const threat = mockThreats.find((t) => t.id === threatId) || mockThreats[0];
      return {
        success: true,
        threatId: threat.id,
        threatName: threat.name,
        currentStage: threat.currentStage,
        nextLikelyStage: threat.nextLikelyStage,
        nextLikelyProbability: threat.nextLikelyProbability,
        forecastTimeline: threat.forecastTimeline,
      };
    }
  },

  /**
   * AI Explainability APIs
   */
  async getExplainability(threatId: string): Promise<any> {
    try {
      return await fetchJson(`/explainability/${threatId}`);
    } catch (err) {
      console.warn(`[SentinelFlowAPI] Explainability fetch fallback for ${threatId}:`, err);
      const threat = mockThreats.find((t) => t.id === threatId) || mockThreats[0];
      return {
        success: true,
        threatId: threat.id,
        threatName: threat.name,
        contributingFactors: threat.contributingFactors,
        plainLanguageExplanation: threat.plainLanguageExplanation,
        riskScore: threat.riskScore,
        confidence: threat.confidence,
      };
    }
  },

  /**
   * What-If Defense Simulation APIs
   */
  async simulateDefense(threatId: string, actionIds: string[], baseRiskScore?: number): Promise<SimulationResponse> {
    try {
      const res = await fetchJson<{ success: boolean; data: SimulationResponse }>('/simulate', {
        method: 'POST',
        body: JSON.stringify({ threatId, actionIds, baseRiskScore }),
      });
      return res.data;
    } catch (err) {
      console.warn('[SentinelFlowAPI] Defense simulation fallback calculation:', err);
      const threat = mockThreats.find((t) => t.id === threatId) || mockThreats[0];
      const baseline = baseRiskScore || threat.riskScore;
      const actions = threat.simulatedActions.filter((a) => actionIds.includes(a.id));
      let rem = 1.0;
      actions.forEach((a) => {
        rem *= 1 - (a.riskReductionPercent / 100) * 0.85;
      });
      const totalRedFrac = Math.min(0.92, 1 - rem);
      const projected = Math.max(10, Math.round(baseline * (1 - totalRedFrac)));
      const redPercent = Math.round(((baseline - projected) / baseline) * 100);

      return {
        baselineRiskScore: baseline,
        projectedRiskScore: projected,
        totalRiskReductionPercent: redPercent,
        appliedActions: actions,
        isSimulationOnly: true,
        disclaimer: 'Simulation only — no real infrastructure changes will be performed.',
        analysis: `Applying ${actions.length} countermeasure(s) reduces projected risk from ${baseline} to ${projected} (-${redPercent}%).`,
      };
    }
  },

  /**
   * Prioritized Recommendations APIs
   */
  async getRecommendations(threatId: string): Promise<any> {
    try {
      return await fetchJson(`/recommendations/${threatId}`);
    } catch (err) {
      console.warn(`[SentinelFlowAPI] Recommendations fallback for ${threatId}:`, err);
      const threat = mockThreats.find((t) => t.id === threatId) || mockThreats[0];
      return {
        success: true,
        threatId: threat.id,
        threatName: threat.name,
        recommendations: threat.recommendations,
      };
    }
  },

  /**
   * Security Event Simulator APIs
   */
  async getSimulatorScenarios(): Promise<ScenarioInfo[]> {
    try {
      const res = await fetchJson<{ success: boolean; data: ScenarioInfo[] }>('/simulator/scenarios');
      return res.data;
    } catch (err) {
      console.warn('[SentinelFlowAPI] Simulator scenarios fallback:', err);
      return [
        {
          type: 'normal_activity',
          name: 'Normal Operational Telemetry',
          category: 'Baseline',
          description: 'Routine scheduled backups, standard Active Directory logins, and DNS health queries.',
        },
        {
          type: 'brute_force',
          name: 'Distributed Brute Force / Password Spray',
          category: 'Authentication',
          description: 'Cluster of rapid failed authentications against VPN/AD followed by account lockout signals.',
        },
        {
          type: 'port_scanning',
          name: 'SYN Port Sweep & Service Discovery',
          category: 'Reconnaissance',
          description: 'Rapid sequential probe of sensitive service ports (88, 389, 445, 3389) on domain controllers.',
        },
        {
          type: 'suspicious_login',
          name: 'Suspicious Off-Hours Login Anomaly',
          category: 'Identity',
          description: 'Privileged service account authentication from an unregistered device and suspicious ASN.',
        },
        {
          type: 'privilege_escalation',
          name: 'SeImpersonate Token Escalation',
          category: 'Privilege',
          description: 'Web application child process abusing named pipe tokens to elevate to NT AUTHORITY\\SYSTEM.',
        },
        {
          type: 'lateral_movement',
          name: 'Lateral Remote WMI / SMB Propagation',
          category: 'Lateral',
          description: 'Inter-subnet command invocation and administrative share staging targeting file server.',
        },
        {
          type: 'data_exfiltration',
          name: 'Anomalous Encrypted Egress Spike',
          category: 'Exfiltration',
          description: 'High-volume outbound data transfer (>4GB) from database server to unclassified external VPS.',
        },
        {
          type: 'multi_stage_attack',
          name: 'Full Multi-Stage Kill Chain Attack',
          category: 'Advanced Threat',
          description: 'Full coordinated sequence: Port Scan → Password Guess → Token Elevation → Lateral SMB → Data Egress.',
        },
      ];
    }
  },

  async triggerScenario(scenario: string): Promise<any> {
    return await fetchJson('/simulator/trigger', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    });
  },

  async generateSimulatorBatch(scenario: string, count = 3): Promise<any> {
    return await fetchJson('/simulator/batch', {
      method: 'POST',
      body: JSON.stringify({ scenario, count }),
    });
  },
};
