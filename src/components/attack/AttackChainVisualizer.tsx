import React from 'react';
import { AttackStage, AttackStageId } from '../../types';
import { CheckCircle, AlertTriangle, Clock, Circle, ArrowRight } from 'lucide-react';
import { getStageStatusClasses } from '../../utils/formatters';

interface AttackChainVisualizerProps {
  stages: AttackStage[];
  selectedStageId?: AttackStageId;
  onSelectStage?: (stage: AttackStage) => void;
  compact?: boolean;
}

export const AttackChainVisualizer: React.FC<AttackChainVisualizerProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  compact = false,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />;
      case 'current':
        return <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0 animate-bounce" />;
      case 'predicted':
        return <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />;
      case 'not-reached':
      default:
        return <Circle className="h-3.5 w-3.5 text-slate-400 shrink-0" />;
    }
  };

  const getStatusTag = (stage: AttackStage) => {
    switch (stage.status) {
      case 'completed':
        return <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">COMPLETED</span>;
      case 'current':
        return <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-300 animate-pulse">ACTIVE STAGE</span>;
      case 'predicted':
        return <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{stage.confidence ? `${stage.confidence}% FORECAST` : 'PREDICTED'}</span>;
      case 'not-reached':
      default:
        return <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">NOT REACHED</span>;
    }
  };

  if (compact) {
    return (
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex items-center min-w-[700px] gap-2">
          {stages.map((stage, idx) => {
            const styles = getStageStatusClasses(stage.status);
            const isSelected = selectedStageId === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => onSelectStage && onSelectStage(stage)}
                  className={`flex-1 p-2.5 rounded-lg border text-left transition-all ${
                    onSelectStage ? 'cursor-pointer hover:border-indigo-300' : ''
                  } ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                      : stage.status === 'current'
                      ? 'border-red-400 bg-red-50/40 ring-1 ring-red-200'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-slate-500">#{stage.order}</span>
                    {getStatusIcon(stage.status)}
                  </div>
                  <div className="text-xs font-semibold text-slate-900 truncate">{stage.name}</div>
                  <div className="mt-1">{getStatusTag(stage)}</div>
                </div>

                {idx < stages.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visual Timeline Bar / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {stages.map((stage) => {
          const isSelected = selectedStageId === stage.id;
          const isCurrent = stage.status === 'current';

          return (
            <div
              key={stage.id}
              onClick={() => onSelectStage && onSelectStage(stage)}
              className={`p-3.5 rounded-xl border transition-all text-left ${
                onSelectStage ? 'cursor-pointer hover:shadow-sm' : ''
              } ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200 shadow-xs'
                  : isCurrent
                  ? 'border-red-400 bg-red-50/50 ring-1 ring-red-200'
                  : stage.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : stage.status === 'predicted'
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500">STAGE {stage.order} OF 8</span>
                {getStatusIcon(stage.status)}
              </div>

              <h4 className="text-xs md:text-sm font-bold text-slate-900 leading-snug">{stage.name}</h4>

              {stage.mitreTechniqueId && (
                <div className="text-[11px] font-mono text-indigo-700 mt-1">
                  {stage.mitreTechniqueId}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                {getStatusTag(stage)}
                {stage.timestamp && (
                  <span className="text-[10px] text-slate-500 font-medium">{stage.timestamp}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
