import React from 'react';
import { ForecastStage } from '../../types';
import { Card } from '../common/Card';
import { Clock, TrendingUp, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ForecastTimelineProps {
  timeline: ForecastStage[];
  threatName?: string;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  timeline,
  threatName,
}) => {
  return (
    <Card
      title="Attack Escalation Forecast Timeline"
      subtitle={threatName ? `Temporal forecast for ${threatName}` : 'Anticipated attack milestones and probability'}
      icon={<TrendingUp className="h-5 w-5" />}
    >
      <div className="space-y-4">
        {timeline.map((item, index) => {
          const getBarColor = (prob: number) => {
            if (prob >= 70) return 'bg-red-600';
            if (prob >= 50) return 'bg-orange-600';
            if (prob >= 35) return 'bg-amber-500';
            return 'bg-indigo-600';
          };

          return (
            <div
              key={item.stageId}
              className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-bold text-sm text-slate-900">{item.stageName}</span>
                    <span className="ml-2 font-mono text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                      {item.mitreRef}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-slate-200">
                    <Clock className="h-3.5 w-3.5 text-slate-500" /> {item.timeWindow}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 w-12 text-right">
                    {item.probability}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-2.5">
                <div
                  className={`h-full rounded-full ${getBarColor(item.probability)} transition-all duration-500`}
                  style={{ width: `${item.probability}%` }}
                />
              </div>

              {/* Key Anticipated Indicators */}
              <div className="text-xs text-slate-600 font-medium">
                <strong className="text-slate-800">Forecast Signals:</strong>{' '}
                {item.keyIndicators.join(' • ')}
              </div>
            </div>
          );
        })}

        {/* Prototype & Methodology Notice */}
        <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5 font-medium leading-relaxed">
          <AlertCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-950 font-bold block mb-0.5">Forecast Methodology & Prototype Notice:</strong>
            Forecast is based on observed attack behavior, correlated security events, and MITRE ATT&CK Markov progression patterns. Prototype demonstration model — designed for SOC anticipation and proactive defense planning.
          </div>
        </div>
      </div>
    </Card>
  );
};
