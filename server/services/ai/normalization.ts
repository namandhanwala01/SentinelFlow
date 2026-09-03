import { SecurityEvent } from '../../types';

export interface RawEventInput {
  timestamp?: string;
  event_type?: string;
  event?: string;
  source?: string;
  user?: string;
  source_ip?: string;
  destination?: string;
  destination_host?: string;
  destination_ip?: string;
  status?: string;
  severity?: string;
  device?: string;
  details?: string;
  raw_payload?: Record<string, any>;
  [key: string]: any;
}

export interface NormalizedSecurityEvent {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  sourceIp: string;
  destination: string;
  destinationIp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  user: string;
  status: string;
  device: string;
  details: string;
  rawPayload: Record<string, any>;
}

export class NormalizationService {
  /**
   * Normalizes incoming raw telemetry from SIEM, Syslog, EDR, IDS, or Simulator
   */
  public static normalize(raw: RawEventInput): NormalizedSecurityEvent {
    const timestamp = raw.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
    const sourceIp = raw.source_ip || raw.sourceIp || raw.src_ip || '127.0.0.1';
    const destination = raw.destination || raw.destination_host || raw.target_host || raw.host || 'DC-01';
    const destinationIp = raw.destination_ip || raw.destinationIp || raw.dest_ip || '10.0.4.12';
    const user = raw.user || raw.username || raw.target_user || 'system';
    const status = (raw.status || 'observed').toLowerCase();
    const device = raw.device || raw.sensor || 'SOC-Collector-01';

    let eventName = raw.event || raw.event_type || 'Security Telemetry Event';
    let category = 'Network Connection';
    let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' = 'INFO';

    // Heuristic categorization based on payload signals
    const eventType = (raw.event_type || raw.event || '').toLowerCase();
    const details = raw.details || JSON.stringify(raw);

    if (eventType.includes('login') || eventType.includes('auth') || eventType.includes('kerberos') || eventType.includes('password')) {
      category = 'Authentication';
      if (status === 'failed') {
        severity = 'HIGH';
        eventName = eventName || `Failed Authentication for ${user}`;
      } else {
        severity = status === 'suspicious' ? 'HIGH' : 'MEDIUM';
        eventName = eventName || `Authentication Success for ${user}`;
      }
    } else if (eventType.includes('scan') || eventType.includes('port') || eventType.includes('sweep') || eventType.includes('syn')) {
      category = 'Network Connection';
      severity = 'MEDIUM';
      eventName = eventName || 'Network Port Sweep / Reconnaissance';
    } else if (eventType.includes('privilege') || eventType.includes('token') || eventType.includes('uac') || eventType.includes('impersonat')) {
      category = 'Privilege';
      severity = 'CRITICAL';
      eventName = eventName || `Privilege Escalation on ${destination}`;
    } else if (eventType.includes('process') || eventType.includes('exec') || eventType.includes('powershell') || eventType.includes('cmd')) {
      category = 'Process Execution';
      severity = 'HIGH';
      eventName = eventName || 'Suspicious Process Execution';
    } else if (eventType.includes('lateral') || eventType.includes('wmi') || eventType.includes('psexec') || eventType.includes('smb')) {
      category = 'Network Connection';
      severity = 'HIGH';
      eventName = eventName || `Lateral Movement Attempt to ${destination}`;
    } else if (eventType.includes('exfil') || eventType.includes('egress') || eventType.includes('bandwidth')) {
      category = 'Network Connection';
      severity = 'HIGH';
      eventName = eventName || `Anomalous Egress from ${destination}`;
    }

    if (raw.severity) {
      const s = raw.severity.toUpperCase();
      if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'].includes(s)) {
        severity = s as any;
      }
    }

    const eventId = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return {
      id: eventId,
      timestamp,
      event: eventName,
      source: raw.source || `SentinelFlow Ingestion Engine (${device})`,
      sourceIp,
      destination,
      destinationIp,
      severity,
      category,
      user,
      status,
      device,
      details: raw.details || `Telemetry event [${eventName}] recorded from source ${sourceIp} targeting ${destination} (User: ${user}, Status: ${status}).`,
      rawPayload: raw.raw_payload || raw,
    };
  }

  /**
   * Convert normalized event to standard SecurityEvent domain entity
   */
  public static toSecurityEvent(normalized: NormalizedSecurityEvent, threatId?: string): SecurityEvent {
    return {
      id: normalized.id,
      timestamp: normalized.timestamp,
      event: normalized.event,
      source: normalized.source,
      sourceIp: normalized.sourceIp,
      destination: normalized.destination,
      destinationIp: normalized.destinationIp,
      severity: normalized.severity,
      category: normalized.category,
      details: normalized.details,
      threatId,
      rawPayload: normalized.rawPayload,
    };
  }
}
