import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Threat, MonitoredSystem, SecurityEvent, MetricSummary } from '../types';
import { mockThreats, mockSystems, mockEvents } from '../data';

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
}

const ThreatContext = createContext<ThreatContextType | undefined>(undefined);

export const ThreatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threats] = useState<Threat[]>(mockThreats);
  const [selectedThreatId, setSelectedThreatId] = useState<string>('THREAT-001');
  const [systems] = useState<MonitoredSystem[]>(mockSystems);
  const [events] = useState<SecurityEvent[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLiveMonitoring, setIsLiveMonitoring] = useState<boolean>(true);

  // By default, select the first simulated action for the active threat
  const [activeSimulatedActionIds, setActiveSimulatedActionIds] = useState<string[]>(['block_ip']);

  const selectedThreat = useMemo(() => {
    const found = threats.find((t) => t.id === selectedThreatId);
    return found || threats[0];
  }, [threats, selectedThreatId]);

  const handleSetSelectedThreatId = useCallback((id: string) => {
    setSelectedThreatId(id);
    const targetThreat = mockThreats.find((t) => t.id === id);
    if (targetThreat && targetThreat.simulatedActions.length > 0) {
      setActiveSimulatedActionIds([targetThreat.simulatedActions[0].id]);
    } else {
      setActiveSimulatedActionIds([]);
    }
  }, []);

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

  // Compute dynamic simulated risk score and reduction percentage
  const { simulatedRiskScore, simulatedRiskReductionPercent } = useMemo(() => {
    const baseRisk = selectedThreat.riskScore;
    if (activeSimulatedActionIds.length === 0) {
      return { simulatedRiskScore: baseRisk, simulatedRiskReductionPercent: 0 };
    }

    // Find all active simulated action objects
    const activeActions = selectedThreat.simulatedActions.filter((a) =>
      activeSimulatedActionIds.includes(a.id)
    );

    if (activeActions.length === 0) {
      return { simulatedRiskScore: baseRisk, simulatedRiskReductionPercent: 0 };
    }

    // Compute cumulative diminishing reduction:
    // Combined reduction = 1 - product(1 - r_i)
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
      overallRiskScore: 87, // High enterprise risk score baseline
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
