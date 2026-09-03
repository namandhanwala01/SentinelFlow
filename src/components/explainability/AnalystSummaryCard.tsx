import React from 'react';
import { Card } from '../common/Card';
import { HelpCircle, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { Threat } from '../../types';

interface AnalystSummaryCardProps {
  threat: Threat;
}

export const AnalystSummaryCard: React.FC<AnalystSummaryCardProps> = ({ threat }) => {
  return (
    <Card
      title="Why did SentinelFlow flag this threat?"
      subtitle="Plain-language AI explainability analysis for SOC analysts"
      icon={<HelpCircle className="h-5 w-5" />}
      borderVariant="brand"
    >
      <div className="space-y-4">
        {/* Core Narrative Quote */}
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Analyst Executive Summary</span>
          </div>
          <p className="text-sm md:text-base text-slate-900 font-medium leading-relaxed">
            "{threat.plainLanguageExplanation}"
          </p>
        </div>

        {/* Breakdown highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Primary Anomaly Vector
            </span>
            <div className="text-xs font-semibold text-slate-900 mt-1">
              {threat.attackType}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Source IP: <span className="font-mono text-slate-900">{threat.sourceIp}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Detection Confidence & Severity
            </span>
            <div className="text-xs font-semibold text-slate-900 mt-1">
              {threat.confidence}% Model Confidence
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Target Asset: <strong className="text-slate-900">{threat.affectedSystem}</strong> ({threat.affectedSystemIp})
            </div>
          </div>
        </div>

        {/* Explainability notice */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            Model factors are computed based on cross-correlated authentication telemetry, historical baseline deviation, and network reputation feeds. No raw weights or black-box predictions are hidden from the analyst.
          </span>
        </div>
      </div>
    </Card>
  );
};
