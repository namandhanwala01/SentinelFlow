import React from 'react';
import { Card } from '../common/Card';
import { Sparkles, Clock, Target, ArrowUpRight } from 'lucide-react';
import { Threat } from '../../types';

interface NextLikelyStageCardProps {
  threat: Threat;
  onClickInspect?: () => void;
}

export const NextLikelyStageCard: React.FC<NextLikelyStageCardProps> = ({
  threat,
  onClickInspect,
}) => {
  return (
    <Card
      borderVariant="brand"
      className="bg-gradient-to-br from-white via-indigo-50/20 to-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-indigo-100 text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
              AI Forecasted Next Stage
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {threat.nextLikelyStage}
          </h3>

          <p className="text-xs text-slate-600 mt-1">
            Predicted progression for <strong className="text-slate-900">{threat.name}</strong> on {threat.affectedSystem}
          </p>
        </div>

        {/* Probability Metric Display */}
        <div className="flex items-center gap-4 sm:border-l sm:border-slate-200 sm:pl-6 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Escalation Probability
            </span>
            <div className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
              {threat.nextLikelyProbability}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
