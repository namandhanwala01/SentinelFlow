import React, { useState } from 'react';
import { MonitoredSystem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getSystemHealthClasses, getRiskBadgeClasses } from '../../utils/formatters';
import { Server, Activity, ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SystemsTableProps {
  systems: MonitoredSystem[];
}

export const SystemsTable: React.FC<SystemsTableProps> = ({ systems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const navigate = useNavigate();

  const filteredSystems = systems.filter((sys) => {
    const matchesSearch =
      searchTerm === '' ||
      sys.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.ipAddress.includes(searchTerm) ||
      sys.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || sys.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search host, IP, OS, department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">Filter Health:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500"
          >
            <option value="ALL">All States</option>
            <option value="Critical">Critical</option>
            <option value="At Risk">At Risk</option>
            <option value="Healthy">Healthy</option>
          </select>
        </div>
      </div>

      {/* Systems Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3.5">System Name</th>
              <th className="px-4 py-3.5">System Type & OS</th>
              <th className="px-4 py-3.5">IP Address</th>
              <th className="px-4 py-3.5">Environment</th>
              <th className="px-4 py-3.5">Health Status</th>
              <th className="px-4 py-3.5">Risk Score</th>
              <th className="px-4 py-3.5">Active Threats</th>
              <th className="px-4 py-3.5">Last Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
            {filteredSystems.map((sys) => (
              <tr key={sys.id} className="hover:bg-slate-50 transition-colors">
                {/* System Name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{sys.name}</div>
                      <div className="text-[11px] text-slate-500">{sys.department}</div>
                    </div>
                  </div>
                </td>

                {/* Type & OS */}
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900">{sys.type}</div>
                  <div className="text-[11px] text-slate-500">{sys.os}</div>
                </td>

                {/* IP Address */}
                <td className="px-4 py-3.5 font-mono text-xs text-slate-700">
                  {sys.ipAddress}
                </td>

                {/* Environment */}
                <td className="px-4 py-3.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {sys.environment}
                  </span>
                </td>

                {/* Health Status */}
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${getSystemHealthClasses(sys.status)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {sys.status}
                  </span>
                </td>

                {/* Risk Score */}
                <td className="px-4 py-3.5 font-extrabold text-slate-900">
                  <span className={`px-2 py-0.5 rounded text-xs ${getRiskBadgeClasses(sys.riskScore >= 80 ? 'CRITICAL' : sys.riskScore >= 50 ? 'HIGH' : 'LOW')}`}>
                    {sys.riskScore} / 100
                  </span>
                </td>

                {/* Active Threats */}
                <td className="px-4 py-3.5">
                  {sys.activeThreatsCount > 0 ? (
                    <button
                      onClick={() => navigate('/threats')}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 transition-colors"
                    >
                      <ShieldAlert className="h-3 w-3" />
                      {sys.activeThreatsCount} Active Threat{sys.activeThreatsCount > 1 ? 's' : ''}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="h-3 w-3" /> Nominal
                    </span>
                  )}
                </td>

                {/* Last Seen */}
                <td className="px-4 py-3.5 text-slate-500 text-xs">
                  {sys.lastSeen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
