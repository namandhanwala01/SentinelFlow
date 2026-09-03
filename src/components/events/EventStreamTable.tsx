import React, { useState, useMemo } from 'react';
import { SecurityEvent } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getRiskBadgeClasses } from '../../utils/formatters';
import {
  Search,
  Filter,
  Activity,
  Terminal,
  Clock,
  Server,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThreatContext } from '../../context/ThreatContext';

interface EventStreamTableProps {
  events: SecurityEvent[];
  initialThreatFilter?: string;
}

export const EventStreamTable: React.FC<EventStreamTableProps> = ({
  events,
  initialThreatFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const navigate = useNavigate();
  const { setSelectedThreatId } = useThreatContext();

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        searchTerm === '' ||
        evt.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.sourceIp.includes(searchTerm) ||
        evt.destination.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === 'ALL' || evt.severity === severityFilter;

      const matchesCategory =
        categoryFilter === 'ALL' || evt.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [events, searchTerm, severityFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter event stream by keyword, IP, host..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-lg outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
            <Filter className="h-3.5 w-3.5" /> Severity:
          </div>
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="INFO">Info</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Authentication">Authentication</option>
            <option value="Process Execution">Process Execution</option>
            <option value="Network Connection">Network Connection</option>
            <option value="Privilege">Privilege</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-sm font-sans">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Timestamp (UTC)</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Event Summary</th>
              <th className="px-4 py-3">Source & IP</th>
              <th className="px-4 py-3">Destination Host</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No telemetry events match the filter parameters.
                </td>
              </tr>
            ) : (
              paginatedEvents.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* Timestamp */}
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    {evt.timestamp}
                  </td>

                  {/* Severity Badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getRiskBadgeClasses(evt.severity)}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {evt.severity}
                    </span>
                  </td>

                  {/* Event Summary */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 line-clamp-1">{evt.event}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-sm">{evt.details}</div>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{evt.source}</div>
                    <div className="font-mono text-[11px] text-slate-500">{evt.sourceIp}</div>
                  </td>

                  {/* Destination */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <Server className="h-3 w-3 text-slate-400" />
                      {evt.destination}
                    </div>
                    {evt.destinationIp && (
                      <div className="font-mono text-[11px] text-slate-500">{evt.destinationIp}</div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {evt.category}
                    </span>
                  </td>

                  {/* Details Action */}
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(evt);
                      }}
                      className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{paginatedEvents.length}</strong> of{' '}
            <strong className="text-slate-900">{filteredEvents.length}</strong> events
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

      {/* Event Details Inspector Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-elevated max-w-2xl w-full p-6 animate-in fade-in-50 duration-150">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRiskBadgeClasses(selectedEvent.severity)}`}>
                    {selectedEvent.severity}
                  </span>
                  <span className="font-mono text-xs text-slate-500 font-semibold">{selectedEvent.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{selectedEvent.event}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Timestamp (UTC)</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedEvent.timestamp}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Security Collector</span>
                  <span className="font-semibold text-slate-900">{selectedEvent.source}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Source IP</span>
                  <span className="font-mono font-semibold text-slate-900">{selectedEvent.sourceIp}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">Target Host</span>
                  <span className="font-semibold text-slate-900">{selectedEvent.destination} ({selectedEvent.destinationIp || 'Internal'})</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Full Telemetry Payload & Context</span>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto">
                  {selectedEvent.details}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              {selectedEvent.threatId ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedThreatId(selectedEvent.threatId!);
                    setSelectedEvent(null);
                    navigate(`/threats/${selectedEvent.threatId}`);
                  }}
                  icon={<ExternalLink className="h-3.5 w-3.5" />}
                >
                  View Linked Threat ({selectedEvent.threatId})
                </Button>
              ) : (
                <span className="text-xs text-slate-500">Uncorrelated background event</span>
              )}
              <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
