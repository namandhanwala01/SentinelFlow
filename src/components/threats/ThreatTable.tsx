import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Threat } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getRiskBadgeClasses } from '../../utils/formatters';
import { ArrowRight, ShieldAlert, Clock, Server, Globe } from 'lucide-react';
import { useThreatContext } from '../../context/ThreatContext';

interface ThreatTableProps {
  threats: Threat[];
}

export const ThreatTable: React.FC<ThreatTableProps> = ({ threats }) => {
  const navigate = useNavigate();
  const { setSelectedThreatId } = useThreatContext();

  const handleRowClick = (threatId: string) => {
    setSelectedThreatId(threatId);
    navigate(`/threats/${threatId}`);
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3.5">Threat Name & Vector</th>
            <th className="px-4 py-3.5">Risk Score</th>
            <th className="px-4 py-3.5">Confidence</th>
            <th className="px-4 py-3.5">Current Stage</th>
            <th className="px-4 py-3.5">Affected System</th>
            <th className="px-4 py-3.5">First Detected</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
          {threats.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                No threats match your active filter criteria.
              </td>
            </tr>
          ) : (
            threats.map((threat) => (
              <tr
                key={threat.id}
                onClick={() => handleRowClick(threat.id)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Threat Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {threat.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {threat.attackType}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Risk */}
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${getRiskBadgeClasses(threat.risk)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {threat.risk} {threat.riskScore}
                  </span>
                </td>

                {/* Confidence */}
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900">{threat.confidence}%</div>
                  <div className="text-[10px] text-slate-500 font-medium">Model certainty</div>
                </td>

                {/* Current Stage */}
                <td className="px-4 py-3.5">
                  <div className="inline-flex items-center gap-1 font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">
                    {threat.currentStage}
                  </div>
                </td>

                {/* Affected System */}
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <Server className="h-3 w-3 text-slate-400" />
                    {threat.affectedSystem}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {threat.affectedSystemIp}
                  </div>
                </td>

                {/* First Detected */}
                <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1 text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {threat.firstDetected.split(' ')[1] || threat.firstDetected}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {threat.firstDetected.split(' ')[0]}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <Badge variant={threat.status === 'Active' ? 'critical' : 'neutral'} size="sm" dot>
                    {threat.status}
                  </Badge>
                </td>

                {/* Action CTA */}
                <td className="px-4 py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 font-bold"
                    icon={<ArrowRight className="h-3.5 w-3.5" />}
                    iconPosition="right"
                  >
                    Investigate
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
