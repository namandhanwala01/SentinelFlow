import React from 'react';
import { Threat } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getRiskBadgeClasses } from '../../utils/formatters';
import {
  ShieldAlert,
  Server,
  Globe,
  Clock,
  Activity,
  Sparkles,
  FlaskConical,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThreatContext } from '../../context/ThreatContext';

interface ThreatSummaryHeroProps {
  threat: Threat;
  onSimulateClick?: () => void;
}

export const ThreatSummaryHero: React.FC<ThreatSummaryHeroProps> = ({
  threat,
  onSimulateClick,
}) => {
  const navigate = useNavigate();
  const { updateThreatStatus } = useThreatContext();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        {/* Title & Risk Badge */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
            <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${getRiskBadgeClasses(threat.risk)}`}>
              {threat.risk} RISK • SCORE {threat.riskScore}/100
            </span>
            <Badge variant="brand" size="sm">
              {threat.confidence}% AI CONFIDENCE
            </Badge>
            <select
              value={threat.status}
              onChange={(e) => {
                const newStatus = e.target.value as any;
                updateThreatStatus(threat.id, newStatus);
              }}
              className="text-xs font-bold px-2 py-0.5 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Investigating">Investigating</option>
              <option value="Contained">Contained</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {threat.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {threat.summary}
          </p>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={<FlaskConical className="h-4 w-4" />}
            onClick={() => onSimulateClick ? onSimulateClick() : navigate('/what-if')}
          >
            Launch What-if Simulator
          </Button>
        </div>
      </div>

      {/* Grid of Key Threat Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Target Host
          </span>
          <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 flex items-center gap-1 truncate">
            <Server className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{threat.affectedSystem}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{threat.affectedSystemIp}</div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Source Origin
          </span>
          <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 flex items-center gap-1 truncate">
            <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-mono">{threat.sourceIp}</span>
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">Untrusted External</div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Current Stage
          </span>
          <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1">
            {threat.currentStage}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Stage 2 of 8</div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Next Likely Stage
          </span>
          <div className="font-bold text-indigo-700 text-xs sm:text-sm mt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-600" />
            <span>{threat.nextLikelyStage}</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-bold mt-0.5">{threat.nextLikelyProbability}% Forecast Probability</div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            First Detected
          </span>
          <div className="font-semibold text-slate-800 text-xs sm:text-sm mt-1">
            {threat.firstDetected.split(' ')[1]}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{threat.firstDetected.split(' ')[0]}</div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Last Activity
          </span>
          <div className="font-semibold text-slate-800 text-xs sm:text-sm mt-1 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{threat.lastSeen}</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Continuous Monitoring</div>
        </div>
      </div>
    </div>
  );
};
