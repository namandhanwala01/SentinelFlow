import { RawEventInput } from './ai/normalization';
import { ThreatPipeline, PipelineExecutionResult } from './ai/pipeline';
import { eventService } from './eventService';
import { threatService } from './threatService';

export type SimulationScenarioType =
  | 'normal_activity'
  | 'brute_force'
  | 'port_scanning'
  | 'suspicious_login'
  | 'privilege_escalation'
  | 'lateral_movement'
  | 'data_exfiltration'
  | 'multi_stage_attack';

export interface ScenarioDefinition {
  type: SimulationScenarioType;
  name: string;
  category: string;
  description: string;
  targetHost: string;
  targetUser: string;
  sourceIp: string;
  generator: () => RawEventInput[];
}

export class SimulatorService {
  public static getAvailableScenarios(): Array<{
    type: SimulationScenarioType;
    name: string;
    description: string;
    category: string;
  }> {
    return [
      {
        type: 'normal_activity',
        name: 'Normal Operational Telemetry',
        category: 'Baseline',
        description: 'Routine scheduled backups, standard Active Directory logins, and DNS health queries.',
      },
      {
        type: 'brute_force',
        name: 'Distributed Brute Force / Password Spray',
        category: 'Authentication',
        description: 'Cluster of rapid failed authentications against VPN/AD followed by account lockout signals.',
      },
      {
        type: 'port_scanning',
        name: 'SYN Port Sweep & Service Discovery',
        category: 'Reconnaissance',
        description: 'Rapid sequential probe of sensitive service ports (88, 389, 445, 3389) on domain controllers.',
      },
      {
        type: 'suspicious_login',
        name: 'Suspicious Off-Hours Login Anomaly',
        category: 'Identity',
        description: 'Privileged service account authentication from an unregistered device and suspicious ASN.',
      },
      {
        type: 'privilege_escalation',
        name: 'SeImpersonate Token Escalation',
        category: 'Privilege',
        description: 'Web application child process abusing named pipe tokens to elevate to NT AUTHORITY\\SYSTEM.',
      },
      {
        type: 'lateral_movement',
        name: 'Lateral Remote WMI / SMB Propagation',
        category: 'Lateral',
        description: 'Inter-subnet command invocation and administrative share staging targeting file server.',
      },
      {
        type: 'data_exfiltration',
        name: 'Anomalous Encrypted Egress Spike',
        category: 'Exfiltration',
        description: 'High-volume outbound data transfer (>4GB) from database server to unclassified external VPS.',
      },
      {
        type: 'multi_stage_attack',
        name: 'Full Multi-Stage Kill Chain Attack',
        category: 'Advanced Threat',
        description: 'Full coordinated sequence: Port Scan → Password Guess → Token Elevation → Lateral SMB → Data Egress.',
      },
    ];
  }

  /**
   * Generates structured raw security events for a given scenario
   */
  public static generateScenarioEvents(scenarioType: SimulationScenarioType): RawEventInput[] {
    const now = new Date();
    const ts = (offsetSec = 0) => {
      const d = new Date(now.getTime() + offsetSec * 1000);
      return d.toISOString().replace('T', ' ').substring(0, 19);
    };

    switch (scenarioType) {
      case 'normal_activity':
        return [
          {
            timestamp: ts(0),
            event_type: 'service_health_check',
            event: 'Routine Daemon Health Heartbeat',
            user: 'system',
            source_ip: '10.0.9.10',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'success',
            severity: 'INFO',
            device: 'SentinelFlow Health Sensor',
            details: 'Routine telemetry ping received; CPU/RAM and disk latency within normal operational limits.',
          },
          {
            timestamp: ts(1),
            event_type: 'login',
            event: 'Standard Kerberos Domain Logon',
            user: 'j.smith@corp.internal',
            source_ip: '10.0.6.104',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'success',
            severity: 'INFO',
            device: 'Windows Event Log 4624',
            details: 'Standard workstation interactive logon authenticated via Kerberos ticket granting service.',
          },
        ];

      case 'brute_force':
        return [
          {
            timestamp: ts(0),
            event_type: 'login',
            event: 'Failed VPN Authentication Attempt',
            user: 'admin_backup',
            source_ip: '45.142.195.88',
            destination_host: 'VPN-GW-01',
            destination_ip: '10.0.1.1',
            status: 'failed',
            severity: 'HIGH',
            device: 'Palo Alto GlobalProtect',
            raw_payload: { failure_count: 12, auth_method: 'RADIUS' },
            details: 'Rapid cluster of 12 failed authentication attempts detected from rotating external proxy IP.',
          },
          {
            timestamp: ts(2),
            event_type: 'login',
            event: 'Account Lockout Threshold Reached',
            user: 'admin_backup',
            source_ip: '45.142.195.88',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'locked',
            severity: 'HIGH',
            device: 'Active Directory Security Log 4740',
            details: 'Account admin_backup temporarily locked out after exceeding failure threshold.',
          },
        ];

      case 'port_scanning':
        return [
          {
            timestamp: ts(0),
            event_type: 'network_scan',
            event: 'TCP SYN Stealth Port Sweep',
            user: 'unknown',
            source_ip: '185.220.101.5',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'detected',
            severity: 'MEDIUM',
            device: 'Suricata IDS Sensor',
            raw_payload: { ports_scanned: [88, 135, 389, 445, 3389], protocol: 'TCP' },
            details: 'High-speed SYN probe detected querying core domain services within 300 milliseconds.',
          },
        ];

      case 'suspicious_login':
        return [
          {
            timestamp: ts(0),
            event_type: 'login',
            event: 'Off-Hours Interactive Admin Logon',
            user: 'svc_backup_admin',
            source_ip: '194.26.29.114',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'suspicious',
            severity: 'HIGH',
            device: 'Windows Event Log 4624 (Logon Type 10)',
            raw_payload: {
              ja4_fingerprint: 't13d1516h2_8daaf6152771_010203040506',
              asn: 'AS200052',
            },
            details: 'RemoteInteractive session initiated for svc_backup_admin from bulletproof hosting IP 194.26.29.114.',
          },
        ];

      case 'privilege_escalation':
        return [
          {
            timestamp: ts(0),
            event_type: 'privilege_escalation',
            event: 'SeImpersonate Named Pipe Token Elevation',
            user: 'IIS_IUSRS -> NT AUTHORITY\\SYSTEM',
            source_ip: '10.0.3.18',
            destination_host: 'APP-PROD-02',
            destination_ip: '10.0.3.18',
            status: 'compromised',
            severity: 'CRITICAL',
            device: 'Microsoft Defender for Endpoint',
            raw_payload: {
              parent_process: 'w3wp.exe',
              child_process: 'cmd.exe',
              token: 'SYSTEM',
            },
            details: 'Web worker process w3wp.exe spawned cmd.exe with SYSTEM token via SweetPotato named pipe reflection.',
          },
        ];

      case 'lateral_movement':
        return [
          {
            timestamp: ts(0),
            event_type: 'lateral_movement',
            event: 'Remote WMI Execution on File Server',
            user: 'svc_backup_admin',
            source_ip: '10.0.3.18',
            destination_host: 'FILE-SRV-01',
            destination_ip: '10.0.5.22',
            status: 'executed',
            severity: 'HIGH',
            device: 'Sysmon Event ID 1',
            raw_payload: {
              process: 'WmiPrvSE.exe -> powershell.exe',
              command_line: 'powershell.exe -enc SQBFAFgA...',
            },
            details: 'Remote command executed on FILE-SRV-01 originating from compromised host APP-PROD-02.',
          },
        ];

      case 'data_exfiltration':
        return [
          {
            timestamp: ts(0),
            event_type: 'data_exfiltration',
            event: 'Anomalous High-Bandwidth TLS Egress',
            user: 'postgres',
            source_ip: '10.0.8.44',
            destination_host: 'External VPS (198.51.100.24)',
            destination_ip: '198.51.100.24',
            status: 'active',
            severity: 'HIGH',
            device: 'Zeek Network Monitor',
            raw_payload: {
              bytes_sent: 4294967296,
              port: 8443,
              duration_sec: 600,
            },
            details: 'Database cluster transmitted 4.2 GB encrypted payload over port 8443 to unclassified external IP.',
          },
        ];

      case 'multi_stage_attack':
        return [
          {
            timestamp: ts(-180),
            event_type: 'network_scan',
            event: 'External Port Sweep on DMZ Host',
            user: 'unknown',
            source_ip: '194.26.29.114',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'detected',
            severity: 'MEDIUM',
            device: 'Suricata IDS',
            details: 'Reconnaissance sweep of ports 88, 389, and 445.',
          },
          {
            timestamp: ts(-120),
            event_type: 'login',
            event: 'Kerberos Pre-Auth Failure Burst',
            user: 'svc_backup_admin',
            source_ip: '194.26.29.114',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'failed',
            severity: 'HIGH',
            device: 'Security Log 4625',
            raw_payload: { failure_count: 8 },
            details: '8 failed credential guessing attempts in 60s.',
          },
          {
            timestamp: ts(-60),
            event_type: 'login',
            event: 'Logon Success for Privileged Account',
            user: 'svc_backup_admin',
            source_ip: '194.26.29.114',
            destination_host: 'DC-01',
            destination_ip: '10.0.4.12',
            status: 'success',
            severity: 'CRITICAL',
            device: 'Security Log 4624',
            details: 'Interactive logon from unknown external IP address.',
          },
          {
            timestamp: ts(0),
            event_type: 'lateral_movement',
            event: 'Lateral WMI Execution Attempt to File Server',
            user: 'svc_backup_admin',
            source_ip: '10.0.4.12',
            destination_host: 'FILE-SRV-01',
            destination_ip: '10.0.5.22',
            status: 'active',
            severity: 'HIGH',
            device: 'EDR Sensor',
            details: 'WMI process execution targeting hidden admin share C$.',
          },
        ];

      default:
        return this.generateScenarioEvents('normal_activity');
    }
  }

  /**
   * Executes a simulation scenario through the real AI pipeline and ingests resulting events/threats
   */
  public static async executeScenario(
    scenarioType: SimulationScenarioType
  ): Promise<{
    scenario: SimulationScenarioType;
    eventsGeneratedCount: number;
    pipelineResults: PipelineExecutionResult[];
  }> {
    const rawEvents = this.generateScenarioEvents(scenarioType);
    const pipelineResults: PipelineExecutionResult[] = [];

    for (const raw of rawEvents) {
      const result = ThreatPipeline.processEvent(raw);
      pipelineResults.push(result);

      // Ingest event into active storage
      await eventService.createEvent(result.normalizedEvent);

      // If threat detected, ingest or update in threat register
      if (result.isThreat && result.threat) {
        await threatService.upsertThreat(result.threat);
      }
    }

    return {
      scenario: scenarioType,
      eventsGeneratedCount: rawEvents.length,
      pipelineResults,
    };
  }
}
