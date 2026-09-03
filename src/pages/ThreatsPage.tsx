import React, { useState, useMemo } from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { ThreatTable } from '../components/threats/ThreatTable';
import { Button } from '../components/common/Button';
import {
  Search,
  Filter,
  ShieldAlert,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export const ThreatsPage: React.FC = () => {
  const { threats } = useThreatContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredThreats = useMemo(() => {
    return threats.filter((threat) => {
      const matchesSearch =
        searchTerm === '' ||
        threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.affectedSystem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.sourceIp.includes(searchTerm) ||
        threat.attackType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRisk =
        riskFilter === 'ALL' || threat.risk === riskFilter;

      const matchesStatus =
        statusFilter === 'ALL' || threat.status === statusFilter;

      const matchesStage =
        stageFilter === 'ALL' || threat.currentStage === stageFilter;

      return matchesSearch && matchesRisk && matchesStatus && matchesStage;
    });
  }, [threats, searchTerm, riskFilter, statusFilter, stageFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredThreats.length / pageSize));
  const paginatedThreats = filteredThreats.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setRiskFilter('ALL');
    setStatusFilter('ALL');
    setStageFilter('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Threat Management & Incident Register"
        description="Comprehensive list of identified security threats, risk scoring, active stage telemetry, and containment actions."
        badge={
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
            {threats.length} Recorded Threats
          </span>
        }
      />

      {/* Search & Multi-Dimensional Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by threat name, host, IP, vector..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0 font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
          </div>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Investigating">Investigating</option>
            <option value="Contained">Contained</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="ALL">All Attack Stages</option>
            <option value="Reconnaissance">Reconnaissance</option>
            <option value="Initial Access">Initial Access</option>
            <option value="Execution">Execution</option>
            <option value="Lateral Movement">Lateral Movement</option>
          </select>

          {(searchTerm || riskFilter !== 'ALL' || statusFilter !== 'ALL' || stageFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              icon={<RotateCcw className="h-3 w-3" />}
              className="text-xs text-slate-600 hover:text-slate-900 shrink-0"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Main Threat Table */}
      <ThreatTable threats={paginatedThreats} />

      {/* Pagination Bar */}
      <div className="bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm flex items-center justify-between text-xs text-slate-600">
        <div>
          Showing <strong className="text-slate-900">{paginatedThreats.length}</strong> of{' '}
          <strong className="text-slate-900">{filteredThreats.length}</strong> threats
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            icon={<ChevronLeft className="h-3.5 w-3.5" />}
          >
            Prev
          </Button>
          <span className="font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            icon={<ChevronRight className="h-3.5 w-3.5" />}
            iconPosition="right"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
