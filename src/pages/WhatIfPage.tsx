import React from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatSelectorDropdown } from '../components/common/ThreatSelectorDropdown';
import { WhatIfSimulatorWidget } from '../components/simulation/WhatIfSimulatorWidget';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const WhatIfPage: React.FC = () => {
  const { selectedThreat, simulatedRiskScore, simulatedRiskReductionPercent, activeSimulatedActionIds } = useThreatContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="What-if Defense Simulator (Hero Sandbox)"
        description="Safely evaluate and forecast the impact of tactical cybersecurity countermeasures before taking real-world containment action."
        badge={
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Active Predictive Modeling
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <ThreatSelectorDropdown />
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/recommendations')}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              Review Recommendations
            </Button>
          </div>
        }
      />

      {/* Main Hero Simulation Widget */}
      <WhatIfSimulatorWidget showDetailedGuide={true} />

      {/* Simulation Operations & Safety Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Card title="How the Simulation Engine Works" icon={<HelpCircle className="h-5 w-5" />}>
          <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              1. <strong>Baseline Ingestion:</strong> The engine takes the current threat score (<strong className="text-slate-900">{selectedThreat.riskScore}/100</strong>) and active attack stage.
            </p>
            <p>
              2. <strong>Vector Mitigation Mapping:</strong> Each countermeasure models the severance of specific network routes, credential validity, or host access paths.
            </p>
            <p>
              3. <strong>Residual Risk Projection:</strong> Combined countermeasures account for diminishing returns to calculate a realistic post-containment risk floor (currently <strong className="text-emerald-700 font-bold">{simulatedRiskScore}/100</strong>).
            </p>
          </div>
        </Card>

        <Card title="Operational Next Steps" icon={<CheckCircle2 className="h-5 w-5" />}>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Once your team agrees on the optimal risk-reduction profile, proceed to the formal recommendations dossier to export change tickets for SOC Tier-3 or IT infrastructure teams.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/recommendations')}
                icon={<CheckCircle2 className="h-4 w-4" />}
                className="w-full sm:w-auto"
              >
                Proceed to Action Recommendations ({selectedThreat.recommendations.length} items)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
