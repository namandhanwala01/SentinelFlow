import React, { useState } from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatSelectorDropdown } from '../components/common/ThreatSelectorDropdown';
import { AttackChainVisualizer } from '../components/attack/AttackChainVisualizer';
import { StageDetailCard } from '../components/attack/StageDetailCard';
import { Card } from '../components/common/Card';
import { AttackStage } from '../types';
import { GitFork, Shield, Info, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const AttackIntelPage: React.FC = () => {
  const { selectedThreat } = useThreatContext();
  const navigate = useNavigate();

  const [selectedStage, setSelectedStage] = useState<AttackStage>(
    selectedThreat.stages.find((s) => s.id === selectedThreat.currentStageId) || selectedThreat.stages[0]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attack Intelligence & Kill Chain Analysis"
        description="End-to-end MITRE ATT&CK progression tracking from initial reconnaissance through lateral propagation and exfiltration."
        actions={
          <div className="flex items-center gap-3">
            <ThreatSelectorDropdown />
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/forecast')}
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              View Escalation Forecast
            </Button>
          </div>
        }
      />

      {/* Threat Context Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Target Host & Active Vector
          </span>
          <div className="font-bold text-slate-900 text-sm mt-0.5">
            {selectedThreat.name} — <span className="font-mono text-indigo-700">{selectedThreat.affectedSystem}</span> ({selectedThreat.affectedSystemIp})
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600 font-medium">
          <div>
            Current Phase: <strong className="text-red-600">{selectedThreat.currentStage}</strong>
          </div>
          <div className="border-l border-slate-200 pl-4">
            Confidence: <strong className="text-slate-900">{selectedThreat.confidence}%</strong>
          </div>
        </div>
      </div>

      {/* Visual Attack Chain */}
      <Card
        title="MITRE ATT&CK Enterprise Matrix Progression (8 Stages)"
        subtitle="Click any stage below to inspect detailed indicators of compromise (IOCs) and telemetry signals"
        icon={<GitFork className="h-5 w-5" />}
      >
        <AttackChainVisualizer
          stages={selectedThreat.stages}
          selectedStageId={selectedStage.id}
          onSelectStage={(stage) => setSelectedStage(stage)}
        />
      </Card>

      {/* Interactive Stage Inspector Detail Card */}
      <StageDetailCard stage={selectedStage} threatName={selectedThreat.name} />
    </div>
  );
};
