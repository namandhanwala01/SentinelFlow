import React from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatSelectorDropdown } from '../components/common/ThreatSelectorDropdown';
import { NextLikelyStageCard } from '../components/forecast/NextLikelyStageCard';
import { ForecastTimeline } from '../components/forecast/ForecastTimeline';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  TrendingUp,
  FlaskConical,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForecastPage: React.FC = () => {
  const { selectedThreat } = useThreatContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Attack Progression Forecasting"
        description="Predictive behavioral modeling forecasting adversary milestones, expected escalation time windows, and proactive containment opportunities."
        actions={
          <div className="flex items-center gap-3">
            <ThreatSelectorDropdown />
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/what-if')}
              icon={<FlaskConical className="h-4 w-4" />}
            >
              Simulate Defense
            </Button>
          </div>
        }
      />

      {/* Hero Next Likely Stage Card */}
      <NextLikelyStageCard threat={selectedThreat} />

      {/* Temporal Progression Timeline Breakdown */}
      <ForecastTimeline
        timeline={selectedThreat.forecastTimeline}
        threatName={selectedThreat.name}
      />

      {/* Strategic Anticipation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Predictive Rationale & Signals"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              SentinelFlow's sequential progression engine computes transition probabilities by correlating telemetry from the current stage (<strong className="text-red-600">{selectedThreat.currentStage}</strong>) against historical intrusion trajectories and MITRE ATT&CK Markov models.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-1">Key Prediction Drivers:</strong>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                <li>Pre-authentication burst patterns indicate preparation for Kerberoasting / SPN ticket requests.</li>
                <li>Absence of endpoint isolation creates an estimated 10–20 minute window before active credential dumping begins.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card
          title="Recommended Defensive Next Steps"
          icon={<ShieldAlert className="h-5 w-5" />}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/recommendations')}
              className="text-indigo-600 font-bold text-xs"
            >
              View Actions →
            </Button>
          }
        >
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              By intervening before the forecasted <strong>{selectedThreat.nextLikelyStage}</strong> phase begins, SOC analysts can preempt lateral movement and avoid costly endpoint rebuilds.
            </p>
            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-indigo-950 text-xs block">Simulate Preemptive Containment</span>
                <span className="text-[11px] text-slate-600">Model predicted risk drop before committing changes</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/what-if')}
                icon={<FlaskConical className="h-3.5 w-3.5" />}
              >
                Launch Sandbox
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
