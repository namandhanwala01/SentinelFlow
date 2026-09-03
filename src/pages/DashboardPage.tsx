import React from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { MetricCard } from '../components/common/MetricCard';
import { Card } from '../components/common/Card';
import { RiskGauge } from '../components/common/RiskGauge';
import { ThreatTrendChart } from '../components/charts/ThreatTrendChart';
import { AttackChainVisualizer } from '../components/attack/AttackChainVisualizer';
import { NextLikelyStageCard } from '../components/forecast/NextLikelyStageCard';
import { ThreatTable } from '../components/threats/ThreatTable';
import { ThreatSelectorDropdown } from '../components/common/ThreatSelectorDropdown';
import { Button } from '../components/common/Button';
import {
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Server,
  Activity,
  ArrowRight,
  TrendingUp,
  Layers,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSystemHealthClasses } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { metrics, threats, systems, selectedThreat, setSelectedThreatId } = useThreatContext();
  const navigate = useNavigate();

  const topAffectedSystems = systems
    .filter((s) => s.riskScore >= 50)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Security Operations Overview"
        description="Real-time threat detection, attack trajectory forecasting, and prioritized defensive recommendations."
        actions={
          <div className="flex items-center gap-2">
            <ThreatSelectorDropdown />
            <Button
              variant="primary"
              size="md"
              icon={<FlaskConical className="h-4 w-4" />}
              onClick={() => navigate('/what-if')}
            >
              What-if Simulator
            </Button>
          </div>
        }
      />

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Total Threats"
          value={metrics.totalThreats}
          icon={ShieldAlert}
          variant="brand"
          trend={{ value: '+2', label: 'past 2h', isPositive: false }}
          onClick={() => navigate('/threats')}
        />
        <MetricCard
          label="Critical Risk"
          value={metrics.criticalRisk}
          icon={AlertTriangle}
          variant="critical"
          trend={{ value: 'Immediate Action', isPositive: false }}
          onClick={() => navigate('/threats')}
        />
        <MetricCard
          label="High Risk"
          value={metrics.highRisk}
          icon={ShieldAlert}
          variant="high"
          trend={{ value: 'Elevated Risk', isPositive: false }}
          onClick={() => navigate('/threats')}
        />
        <MetricCard
          label="Medium / Low"
          value={metrics.mediumRisk + metrics.lowRisk}
          icon={Activity}
          variant="medium"
          trend={{ value: 'Under Control', isPositive: true }}
          onClick={() => navigate('/threats')}
        />
        <MetricCard
          label="Systems Monitored"
          value={metrics.systemsMonitored}
          icon={Server}
          variant="low"
          trend={{ value: '100% Online', isPositive: true }}
          onClick={() => navigate('/systems')}
        />
      </div>

      {/* Section A & B: Threat Trend Line Chart + Overall Risk Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Risk Score Card */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-slate-900 text-sm">Enterprise Risk Posture</h3>
            <span className="text-[10px] font-bold uppercase bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
              Live Evaluation
            </span>
          </div>

          <div className="py-2">
            <RiskGauge
              score={metrics.overallRiskScore}
              size="lg"
              label="OVERALL RISK"
              change={metrics.riskScoreChange}
              showLevelText={true}
            />
          </div>

          <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Critical Vector: <strong>{selectedThreat.name}</strong></span>
            <button
              onClick={() => navigate('/forecast')}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              Forecast →
            </button>
          </div>
        </div>

        {/* 24-Hour Threat Trend Line Chart */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">24-Hour Threat Activity Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Aggregate detection volume categorized by severity levels</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Interval:</span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">24 Hours</span>
            </div>
          </div>

          <ThreatTrendChart />
        </div>
      </div>

      {/* Section E & F: Visual Attack Progression + AI Forecast Hero */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Active Attack Progression Chain — {selectedThreat.name}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/attack-intelligence')}
            icon={<ArrowRight className="h-3.5 w-3.5" />}
            iconPosition="right"
            className="text-indigo-600 hover:text-indigo-800 font-bold"
          >
            Deep Attack Analysis
          </Button>
        </div>

        <Card padding="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
              <span>Target Asset: <strong className="text-slate-900">{selectedThreat.affectedSystem}</strong> ({selectedThreat.affectedSystemIp})</span>
              <span>Current Phase: <strong className="text-red-600">{selectedThreat.currentStage}</strong></span>
            </div>

            <AttackChainVisualizer
              stages={selectedThreat.stages}
              selectedStageId={selectedThreat.currentStageId}
              compact={true}
            />
          </div>
        </Card>

        {/* Next Likely Stage Highlight Card */}
        <NextLikelyStageCard
          threat={selectedThreat}
          onClickInspect={() => navigate('/forecast')}
        />
      </div>

      {/* Section C & D: Top Affected Systems & Active Threats Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Affected Systems */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="font-bold text-slate-900 text-sm">Top Affected Systems</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/systems')}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-bold py-0.5 px-1.5"
            >
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {topAffectedSystems.map((sys) => (
              <div
                key={sys.id}
                onClick={() => navigate('/systems')}
                className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-xs">{sys.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${getSystemHealthClasses(sys.status)}`}>
                    {sys.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>{sys.type}</span>
                  <span className="font-extrabold text-slate-900">Score {sys.riskScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Threats Table */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Active Threats Requiring Attention</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/threats')}
              icon={<ArrowRight className="h-3.5 w-3.5" />}
              iconPosition="right"
              className="text-indigo-600 hover:text-indigo-800 font-bold"
            >
              View Full Register
            </Button>
          </div>

          <ThreatTable threats={threats.slice(0, 4)} />
        </div>
      </div>
    </div>
  );
};
