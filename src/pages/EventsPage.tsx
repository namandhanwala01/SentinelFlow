import React, { useState } from 'react';
import { useThreatContext } from '../context/ThreatContext';
import { PageHeader } from '../components/common/PageHeader';
import { EventStreamTable } from '../components/events/EventStreamTable';
import { Button } from '../components/common/Button';
import { ScenarioTriggerModal } from '../components/simulator/ScenarioTriggerModal';
import { Radio, RefreshCw, FlaskConical } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, isLiveMonitoring, setIsLiveMonitoring, refreshTelemetry, isLoading } = useThreatContext();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Telemetry & Event Stream"
        description="Unified real-time SIEM/EDR event stream capturing identity authentications, process executions, network probes, and privilege escalations."
        badge={
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Live Ingestion Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<FlaskConical className="h-3.5 w-3.5 text-indigo-600" />}
              onClick={() => setIsSimulatorOpen(true)}
            >
              Inject Scenario
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
              onClick={() => refreshTelemetry()}
            >
              Refresh
            </Button>
            <Button
              variant={isLiveMonitoring ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsLiveMonitoring((prev) => !prev)}
              icon={<Radio className={`h-3.5 w-3.5 ${isLiveMonitoring ? 'animate-pulse' : ''}`} />}
            >
              {isLiveMonitoring ? 'Streaming Live' : 'Paused'}
            </Button>
          </div>
        }
      />

      <EventStreamTable events={events} />

      <ScenarioTriggerModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};

