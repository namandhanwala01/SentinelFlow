import React from 'react';
import { useThreatContext } from '../../context/ThreatContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskGauge } from '../common/RiskGauge';
import { SimulationBanner } from '../common/SimulationBanner';
import {
  FlaskConical,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { getRiskBadgeClasses } from '../../utils/formatters';

export const WhatIfSimulatorWidget: React.FC<{ showDetailedGuide?: boolean }> = ({
  showDetailedGuide = true,
}) => {
  const {
    selectedThreat,
    activeSimulatedActionIds,
    toggleSimulatedAction,
    resetSimulations,
    simulatedRiskScore,
    simulatedRiskReductionPercent,
  } = useThreatContext();

  const baseRisk = selectedThreat.riskScore;
  const isReduced = simulatedRiskScore < baseRisk;

  return (
    <div className="space-y-6">
      <SimulationBanner threatName={selectedThreat.name} />

      {/* Main Dual Gauge Comparison Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Current State Gauge Card */}
        <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Baseline Threat State
          </div>
          <RiskGauge
            score={baseRisk}
            size="lg"
            label="CURRENT RISK"
            showLevelText={true}
          />
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Active Threat: <strong className="text-slate-800">{selectedThreat.name}</strong> on {selectedThreat.affectedSystem}
          </div>
        </div>

        {/* Transition / Delta Impact Centerpiece */}
        <div className="md:col-span-4 bg-gradient-to-b from-slate-50 to-indigo-50/40 rounded-xl border border-indigo-200/80 p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-2.5 rounded-full bg-indigo-600 text-white mb-2 shadow-xs">
            <FlaskConical className="h-6 w-6" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
            Defensive Impact Forecast
          </span>

          <div className="my-3 flex items-baseline gap-1">
            <span
              className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                simulatedRiskReductionPercent > 0 ? 'text-emerald-700' : 'text-slate-700'
              }`}
            >
              {simulatedRiskReductionPercent > 0 ? `-${simulatedRiskReductionPercent}%` : '0%'}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-700 max-w-xs">
            {simulatedRiskReductionPercent > 0 ? (
              <span className="text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                Risk dropped by {baseRisk - simulatedRiskScore} points ({baseRisk} → {simulatedRiskScore})
              </span>
            ) : (
              <span className="text-slate-500">Select one or more defensive actions below to simulate risk reduction.</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {activeSimulatedActionIds.length} action{activeSimulatedActionIds.length !== 1 ? 's' : ''} applied
            </span>
            {activeSimulatedActionIds.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSimulations}
                icon={<RotateCcw className="h-3 w-3" />}
                className="text-slate-600 hover:text-slate-900 text-xs py-1 h-auto"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Simulated Post-Action State Gauge Card */}
        <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
            Post-Intervention Outcome
          </div>
          <RiskGauge
            score={simulatedRiskScore}
            size="lg"
            label="PREDICTED RISK"
            isSimulated={true}
            change={simulatedRiskScore - baseRisk}
            showLevelText={true}
          />
          <div className="mt-3 text-xs text-slate-500 font-medium">
            Projected security posture if simulated actions are committed
          </div>
        </div>
      </div>

      {/* Defensive Actions Selection Matrix */}
      <Card
        title="Simulated Defensive Countermeasures"
        subtitle="Toggle single or multiple actions to model their combined security impact"
        icon={<Sliders className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetSimulations}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Clear All
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {selectedThreat.simulatedActions.map((action) => {
            const isSelected = activeSimulatedActionIds.includes(action.id);

            return (
              <div
                key={action.id}
                onClick={() => toggleSimulatedAction(action.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Action Name + Category */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-5 w-5 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{action.name}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {action.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{action.description}</p>
                    </div>
                  </div>

                  {/* Right: Risk Reduction Metric & Predicted Outcome */}
                  <div className="flex items-center gap-4 sm:shrink-0 pl-8 sm:pl-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-500 font-medium">Risk Reduction</div>
                      <div className="text-sm font-extrabold text-emerald-700">
                        -{action.riskReductionPercent}%
                      </div>
                    </div>

                    <div className="text-right border-l border-slate-200 pl-4">
                      <div className="text-xs text-slate-500 font-medium">Predicted Risk</div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {action.predictedRiskScore} / 100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Impact Analysis Note when Selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-indigo-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                      <strong className="text-indigo-950 font-bold block mb-0.5">Impact Analysis:</strong>
                      <span className="text-slate-700 leading-relaxed">{action.impactAnalysis}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-indigo-100">
                      <strong className="text-indigo-950 font-bold block mb-0.5">Recommendation Note:</strong>
                      <span className="text-slate-700 leading-relaxed">{action.recommendationText}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
