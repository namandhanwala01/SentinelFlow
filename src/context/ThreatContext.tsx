import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Threat, MonitoredSystem, SecurityEvent, MetricSummary, ThreatStatus } from '../types';
import { mockThreats, mockSystems, mockEvents } from '../data';
import { SentinelFlowAPI } from '../services/api';

interface ThreatContextType {
  threats: Threat[];
  selectedThreat: Threat;
  selectedThreatId: string;
  setSelectedThreatId: (id: string) => void;
  systems: MonitoredSystem[];
  events: SecurityEvent[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Simulation state
  activeSimulatedActionIds: string[];
  toggleSimulatedAction: (actionId: string) => void;
  setSingleSimulatedAction: (actionId: string) => void;
  resetSimulations: () => void;
  simulatedRiskScore: number;
  simulatedRiskReductionPercent: number;
  // Live simulation ticker toggle
  isLiveMonitoring: boolean;
  setIsLiveMonitoring: (val: boolean | ((prev: boolean) => boolean)) => void;
  // Metrics summary
  metrics: MetricSummary;
  // API & Synchronization
  apiConnected: boolean;
  isLoading: boolean;
  refreshTelemetry: () => Promise<void>;
  triggerScenario: (scenario: string) => Promise<any>;
  updateThreatStatus: (id: string, status: ThreatStatus) => Promise<void>;
}

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export const ThreatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threats, setThreats] = useState<Threat[]>(mockThreats);
  const [selectedThreatId, setSelectedThreatId] = useState<string>('THREAT-001');
  const [systems, setSystems] = useState<MonitoredSystem[]>(mockSystems);
  const [events, setEvents] = useState<SecurityEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveMonitoring, setIsLiveMonitoring] = useState<boolean>(true);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // By default, select the first simulated action for the active threat
  const [activeSimulatedActionIds, setActiveSimulatedActionIds] = useState<string[]>(['block_ip']);

  // Fetch initial telemetry from backend
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedThreats, fetchedSystems, fetchedEventsResult] = await Promise.all([
        SentinelFlowAPI.getThreats(),
        SentinelFlowAPI.getSystems(),
        SentinelFlowAPI.getEvents({ limit: 50 }),
      ]);

      if (fetchedThreats && fetchedThreats.length > 0) {
        setThreats(fetchedThreats);
      }
      if (fetchedSystems && fetchedSystems.length > 0) {
        setSystems(fetchedSystems);
      }
      if (fetchedEventsResult?.events && fetchedEventsResult.events.length > 0) {
        setEvents(fetchedEventsResult.events);
      }
      setApiConnected(true);
    } catch (err) {
      console.warn('[ThreatContext] Using local data store:', err);
      setApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Refresh telemetry on demand or interval
  const refreshTelemetry = useCallback(async () => {
    try {
      const [fetchedThreats, fetchedEventsResult, fetchedSystems] = await Promise.all([
        SentinelFlowAPI.getThreats(),
        SentinelFlowAPI.getEvents({ limit: 50 }),
        SentinelFlowAPI.getSystems(),
      ]);

      if (fetchedThreats?.length) setThreats(fetchedThreats);
      if (fetchedEventsResult?.events?.length) setEvents(fetchedEventsResult.events);
      if (fetchedSystems?.length) setSystems(fetchedSystems);
      setApiConnected(true);
    } catch (err) {
      console.warn('[ThreatContext] Refresh warning:', err);
    }
  }, []);

  // Poll for live events every 6s when live monitoring is enabled
  useEffect(() => {
    if (!isLiveMonitoring) return;
    const interval = setInterval(() => {
      refreshTelemetry();
    }, 6000);
    return () => clearInterval(interval);
  }, [isLiveMonitoring, refreshTelemetry]);

  const selectedThreat = useMemo(() => {
    const found = threats.find((t) => t.id === selectedThreatId);
    return found || threats[0] || mockThreats[0];
  }, [threats, selectedThreatId]);

  const handleSetSelectedThreatId = useCallback((id: string) => {
    setSelectedThreatId(id);
    const targetThreat = threats.find((t) => t.id === id) || mockThreats.find((t) => t.id === id);
    if (targetThreat && targetThreat.simulatedActions && targetThreat.simulatedActions.length > 0) {
      setActiveSimulatedActionIds([targetThreat.simulatedActions[0].id]);
    } else {
      setActiveSimulatedActionIds([]);
    }
  }, [threats]);

  const toggleSimulatedAction = useCallback((actionId: string) => {
    setActiveSimulatedActionIds((prev) => {
      if (prev.includes(actionId)) {
        return prev.filter((id) => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  }, []);

  const setSingleSimulatedAction = useCallback((actionId: string) => {
    setActiveSimulatedActionIds([actionId]);
  }, []);

  const resetSimulations = useCallback(() => {
    setActiveSimulatedActionIds([]);
  }, []);

  // Trigger attack simulation scenario live
  const triggerScenario = useCallback(
    async (scenario: string) => {
      try {
        const result = await SentinelFlowAPI.triggerScenario(scenario);
        // Immediately refresh state to surface new events and threats
        await refreshTelemetry();
        return result;
      } catch (err) {
        console.error('[ThreatContext] Trigger scenario failed:', err);
        throw err;
      }
    },
    [refreshTelemetry]
  );

  // Update threat status live
  const handleUpdateThreatStatus = useCallback(
    async (id: string, status: ThreatStatus) => {
      // Optimistic update
      setThreats((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      try {
        await SentinelFlowAPI.updateThreatStatus(id, status);
      } catch (err) {
        console.warn(`[ThreatContext] Status update API warning for ${id}:`, err);
      }
    },
    []
  );

  // Compute dynamic simulated risk score and reduction percentage
  const { simulatedRiskScore, simulatedRiskReductionPercent } = useMemo(() => {
    const baseRisk = selectedThreat.riskScore;
    if (activeSimulatedActionIds.length === 0) {
      return { simulatedRiskScore: baseRisk, simulatedRiskReductionPercent: 0 };
    }

    const availableActions = selectedThreat.simulatedActions || [];
    const activeActions = availableActions.filter((a) =>
      activeSimulatedActionIds.includes(a.id)
    );

    if (activeActions.length === 0) {
      return { simulatedRiskScore: baseRisk, simulatedRiskReductionPercent: 0 };
    }

    let remainingFactor = 1.0;
    activeActions.forEach((action) => {
      const reductionFraction = action.riskReductionPercent / 100;
      remainingFactor *= 1 - reductionFraction * 0.85; // realistic diminishing overlap
    });

    const totalReductionFrac = Math.min(0.92, 1 - remainingFactor);
    const calculatedScore = Math.max(10, Math.round(baseRisk * (1 - totalReductionFrac)));
    const actualReductionPercent = Math.round(((baseRisk - calculatedScore) / baseRisk) * 100);

    return {
      simulatedRiskScore: calculatedScore,
      simulatedRiskReductionPercent: actualReductionPercent,
    };
  }, [selectedThreat, activeSimulatedActionIds]);

  // Overall system metrics
  const metrics: MetricSummary = useMemo(() => {
    const critical = threats.filter((t) => t.risk === 'CRITICAL').length;
    const high = threats.filter((t) => t.risk === 'HIGH').length;
    const medium = threats.filter((t) => t.risk === 'MEDIUM').length;
    const low = threats.filter((t) => t.risk === 'LOW').length;

    return {
      totalThreats: threats.length,
      criticalRisk: critical,
      highRisk: high,
      mediumRisk: medium,
      lowRisk: low,
      systemsMonitored: systems.length,
      overallRiskScore: 87,
      riskScoreChange: 4,
    };
  }, [threats, systems]);

  return (
    <ThreatContext.Provider
      value={{
        threats,
        selectedThreat,
        selectedThreatId,
        setSelectedThreatId: handleSetSelectedThreatId,
        systems,
        events,
        searchQuery,
        setSearchQuery,
        activeSimulatedActionIds,
        toggleSimulatedAction,
        setSingleSimulatedAction,
        resetSimulations,
        simulatedRiskScore,
        simulatedRiskReductionPercent,
        isLiveMonitoring,
        setIsLiveMonitoring,
        metrics,
        apiConnected,
        isLoading,
        refreshTelemetry,
        triggerScenario,
        updateThreatStatus: handleUpdateThreatStatus,
      }}
    >
      {children}
    </ThreatContext.Provider>
  );
};

export function useThreatContext(): ThreatContextType {
  const context = useContext(ThreatContext);
  if (!context) {
    throw new Error('useThreatContext must be used within a ThreatProvider');
  }
  return context;
}

