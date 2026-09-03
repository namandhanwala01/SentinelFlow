import React from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatSelectorDropdown } from '../components/common/ThreatSelectorDropdown';
import { ContributingFactorsList } from '../components/explainability/ContributingFactorsList';
import { AnalystSummaryCard } from '../components/explainability/AnalystSummaryCard';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { HelpCircle, FlaskConical, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ExplainabilityPage: React.FC = () => {
  const { selectedThreat } = useThreatContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Explainability & Model Rationale"
        description="Transparent, human-readable breakdown of the telemetry signals, behavioral baselines, and feature weights driving SentinelFlow's threat scoring."
        actions={
          <div className="flex items-center gap-3">
            <ThreatSelectorDropdown />
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/what-if')}
              icon={<FlaskConical className="h-4 w-4 text-indigo-600" />}
            >
              Test Defensive Actions
            </Button>
          </div>
        }
      />

      {/* Analyst Executive Rationale Card */}
      <AnalystSummaryCard threat={selectedThreat} />

      {/* Contributing Factors Breakdown with Horizontal Bars */}
      <ContributingFactorsList
        factors={selectedThreat.contributingFactors}
        threatName={selectedThreat.name}
      />

      {/* Transparency & Governance Standards Box */}
      <Card title="Explainable AI (XAI) Architecture Standards" icon={<ShieldCheck className="h-5 w-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Grounded Telemetry
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Every contributing factor links directly to verifiable raw logs, network flows, or identity audit events.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Black-Box Decisions
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Scores are explained in natural language tailored for Tier-1 to Tier-3 SOC analysts, avoiding obtuse tensor algebra.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Actionable Alignment
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Feature weights directly guide What-if simulation options, highlighting the highest-leverage defensive interventions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
