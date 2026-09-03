import React from 'react';
import { AttackStage } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Shield, Clock, FileCode, CheckCircle2, ListFilter } from 'lucide-react';
import { getStageStatusClasses } from '../../utils/formatters';

interface StageDetailCardProps {
  stage: AttackStage;
  threatName?: string;
}

export const StageDetailCard: React.FC<StageDetailCardProps> = ({ stage, threatName }) => {
  const statusStyles = getStageStatusClasses(stage.status);

  return (
    <Card
      title={`Stage ${stage.order}: ${stage.name}`}
      subtitle={threatName ? `Threat Context: ${threatName}` : undefined}
      icon={<Shield className="h-5 w-5" />}
      actions={
        <div className="flex items-center gap-2">
          {stage.timestamp && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {stage.timestamp}
            </span>
          )}
          <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase ${statusStyles.badge}`}>
            {stage.status.replace('-', ' ')}
          </span>
        </div>
      }
    >
      <div className="space-y-4">
        {/* MITRE ATT&CK Mapping */}
        {stage.mitreTechniqueId && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">MITRE ATT&CK:</span>
            <code className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold">
              {stage.mitreTechniqueId}
            </code>
            {stage.mitreTechniqueName && (
              <span className="text-slate-800 font-medium">— {stage.mitreTechniqueName}</span>
            )}
            {stage.confidence && (
              <span className="ml-auto text-slate-600 font-semibold">
                Confidence: <strong className="text-slate-900">{stage.confidence}%</strong>
              </span>
            )}
          </div>
        )}

        {/* Plain Language Stage Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Stage Description & Impact
          </h4>
          <p className="text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
            {stage.description || 'No observable activity detected for this stage yet in the current threat cycle.'}
          </p>
        </div>

        {/* Observed / Predicted Indicators */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <ListFilter className="h-3.5 w-3.5" /> Indicators of Compromise (IOCs) & Signals
          </h4>
          {stage.indicators && stage.indicators.length > 0 ? (
            <div className="space-y-1.5">
              {stage.indicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                >
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-500">
              No active IOCs registered for this stage.
            </div>
          )}
        </div>

        {/* Security telemetry references */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Related telemetry events: <strong className="text-slate-900">{stage.relatedEventsCount}</strong></span>
          <span className="text-indigo-600 font-semibold">Stage order: {stage.order} / 8</span>
        </div>
      </div>
    </Card>
  );
};
