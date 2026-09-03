import React from 'react';
import { Recommendation } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Info,
  Clock,
  Server,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  threatName?: string;
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  threatName,
}) => {
  const navigate = useNavigate();

  const priorities: Array<'Critical' | 'High' | 'Medium' | 'Low'> = [
    'Critical',
    'High',
    'Medium',
    'Low',
  ];

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'critical';
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
      default:
        return 'low';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-amber-600" />;
      case 'Low':
      default:
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {priorities.map((priority) => {
        const filtered = recommendations.filter((r) => r.priority === priority);
        if (filtered.length === 0) return null;

        return (
          <div key={priority} className="space-y-3">
            <div className="flex items-center gap-2">
              {getPriorityIcon(priority)}
              <h3 className="font-bold text-slate-900 text-sm md:text-base">
                {priority} Priority Actions ({filtered.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filtered.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Badge variant={getPriorityBadgeVariant(rec.priority)} size="sm">
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {rec.actionType}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Timeframe: {rec.suggestedTimeframe}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1.5">
                        {rec.action}
                      </h4>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<FlaskConical className="h-3.5 w-3.5 text-indigo-600" />}
                      onClick={() => navigate('/what-if')}
                      className="shrink-0 self-start text-xs font-semibold"
                    >
                      Simulate Impact
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Reason & Threat Context
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">{rec.reason}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
                      <span className="text-[11px] font-bold text-indigo-900 uppercase block mb-1">
                        Target Asset & Expected Benefit
                      </span>
                      <p className="text-slate-800 font-medium leading-relaxed">
                        <strong className="text-slate-900">Asset:</strong> {rec.affectedAsset}
                        <br />
                        <strong className="text-slate-900">Outcome:</strong> {rec.expectedBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
