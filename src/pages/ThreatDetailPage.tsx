import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatSummaryHero } from '../components/threats/ThreatSummaryHero';
import { AttackChainVisualizer } from '../components/attack/AttackChainVisualizer';
import { StageDetailCard } from '../components/attack/StageDetailCard';
import { NextLikelyStageCard } from '../components/forecast/NextLikelyStageCard';
import { ForecastTimeline } from '../components/forecast/ForecastTimeline';
import { ContributingFactorsList } from '../components/explainability/ContributingFactorsList';
import { AnalystSummaryCard } from '../components/explainability/AnalystSummaryCard';
import { WhatIfSimulatorWidget } from '../components/simulation/WhatIfSimulatorWidget';
import { RecommendationsList } from '../components/recommendations/RecommendationsList';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AttackStage } from '../types';
import {
  ShieldAlert,
  GitFork,
  TrendingUp,
  HelpCircle,
  FlaskConical,
  CheckCircle2,
  Info,
  Server,
  Globe,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const ThreatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { threats, selectedThreat, setSelectedThreatId } = useThreatContext();

  // Active tab inside Threat Detail
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attack' | 'forecast' | 'explainability' | 'simulator' | 'recommendations'
  >('overview');

  // Selected stage for attack chain inspector
  const [selectedStage, setSelectedStage] = useState<AttackStage>(
    selectedThreat.stages.find((s) => s.id === selectedThreat.currentStageId) || selectedThreat.stages[0]
  );

  // Sync route param with context
  useEffect(() => {
    if (id && id !== selectedThreat.id) {
      const exists = threats.some((t) => t.id === id);
      if (exists) {
        setSelectedThreatId(id);
      }
    }
  }, [id, selectedThreat.id, setSelectedThreatId, threats]);

  // Update selected stage when threat changes
  useEffect(() => {
    const current = selectedThreat.stages.find((s) => s.id === selectedThreat.currentStageId);
    setSelectedStage(current || selectedThreat.stages[0]);
  }, [selectedThreat]);

  const tabs = [
    { id: 'overview', label: 'Threat Overview', icon: Info },
    { id: 'attack', label: 'Attack Progression', icon: GitFork },
    { id: 'forecast', label: 'AI Forecast', icon: TrendingUp },
    { id: 'explainability', label: 'Explainability', icon: HelpCircle },
    { id: 'simulator', label: 'What-if Simulator', icon: FlaskConical, hero: true },
    { id: 'recommendations', label: 'Recommendations', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Back button & Page Breadcrumb Header */}
      <PageHeader
        title={`Incident Investigation: ${selectedThreat.id}`}
        description="Comprehensive deep-dive analysis, stage progression timeline, forecasted vectors, and defensive simulations."
        breadcrumbs={[
          { label: 'Threats Register', href: '/threats' },
          { label: selectedThreat.id },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/threats')}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Threats
          </Button>
        }
      />

      {/* Hero Summary Header Card */}
      <ThreatSummaryHero
        threat={selectedThreat}
        onSimulateClick={() => setActiveTab('simulator')}
      />

      {/* Synchronized Tab Navigation Strip */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-xs">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 text-indigo-700 font-bold bg-indigo-50/40 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.hero && (
                  <span className="text-[9px] font-extrabold bg-indigo-600 text-white px-1.5 py-0.2 rounded">
                    HERO
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="pt-2">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Plain-language summary & Metadata */}
              <div className="lg:col-span-7 space-y-6">
                <AnalystSummaryCard threat={selectedThreat} />

                {/* Security Metadata Box */}
                <Card title="Threat Vector & Security Metadata" icon={<ShieldAlert className="h-5 w-5" />}>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Attack Category / Vector:</span>
                      <strong className="text-slate-900">{selectedThreat.attackType}</strong>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Attribution / Threat Actor:</span>
                      <strong className="text-slate-900">{selectedThreat.threatActor || 'Unclassified Threat Group'}</strong>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Observed Ingress Channel:</span>
                      <span className="font-mono text-slate-900 font-semibold">{selectedThreat.sourceIp}</span>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Target Host Environment:</span>
                      <strong className="text-slate-900">{selectedThreat.affectedSystem} ({selectedThreat.affectedSystemIp})</strong>
                    </div>
                    <div className="py-2.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Incident Lifecycle Status:</span>
                      <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        {selectedThreat.status} • Active Containment Recommended
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column: AI Next Likely Stage + Contributing Factors */}
              <div className="lg:col-span-5 space-y-6">
                <NextLikelyStageCard
                  threat={selectedThreat}
                  onClickInspect={() => setActiveTab('forecast')}
                />

                <ContributingFactorsList
                  factors={selectedThreat.contributingFactors.slice(0, 4)}
                  threatName={selectedThreat.name}
                />
              </div>
            </div>

            {/* Compact Progression Bar on Overview */}
            <Card title="Attack Progression Overview" icon={<GitFork className="h-5 w-5" />}>
              <AttackChainVisualizer
                stages={selectedThreat.stages}
                selectedStageId={selectedThreat.currentStageId}
                compact={true}
              />
            </Card>
          </div>
        )}

        {/* TAB 2: ATTACK PROGRESSION */}
        {activeTab === 'attack' && (
          <div className="space-y-6">
            <Card
              title="MITRE ATT&CK 8-Stage Progression Visualizer"
              subtitle="Select any stage below to inspect indicators, timestamps, and observed telemetry"
              icon={<GitFork className="h-5 w-5" />}
            >
              <AttackChainVisualizer
                stages={selectedThreat.stages}
                selectedStageId={selectedStage.id}
                onSelectStage={(stage) => setSelectedStage(stage)}
              />
            </Card>

            <StageDetailCard stage={selectedStage} threatName={selectedThreat.name} />
          </div>
        )}

        {/* TAB 3: FORECAST */}
        {activeTab === 'forecast' && (
          <div className="space-y-6">
            <NextLikelyStageCard threat={selectedThreat} />
            <ForecastTimeline
              timeline={selectedThreat.forecastTimeline}
              threatName={selectedThreat.name}
            />
          </div>
        )}

        {/* TAB 4: EXPLAINABILITY */}
        {activeTab === 'explainability' && (
          <div className="space-y-6">
            <AnalystSummaryCard threat={selectedThreat} />
            <ContributingFactorsList
              factors={selectedThreat.contributingFactors}
              threatName={selectedThreat.name}
            />
          </div>
        )}

        {/* TAB 5: WHAT-IF SIMULATOR */}
        {activeTab === 'simulator' && (
          <WhatIfSimulatorWidget />
        )}

        {/* TAB 6: RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <RecommendationsList
            recommendations={selectedThreat.recommendations}
            threatName={selectedThreat.name}
          />
        )}
      </div>
    </div>
  );
};
