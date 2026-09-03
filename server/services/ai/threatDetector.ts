import { SecurityFeatureVector } from './featureExtractor';
import { NormalizedSecurityEvent } from './normalization';
import { RiskLevel } from '../../types';

export interface DetectionResult {
  isThreat: boolean;
  threatName: string;
  attackType: string;
  risk: RiskLevel;
  riskScore: number;
  confidence: number;
  threatActor: string;
  summary: string;
}

export class ThreatDetectionService {
  /**
   * Evaluates feature vector and classifies threat type, risk score, and confidence
   */
  public static detectThreat(
    event: NormalizedSecurityEvent,
    features: SecurityFeatureVector
  ): DetectionResult {
    const riskScore = features.overallFeatureScore;
    let confidence = 85;
    let isThreat = true;
    let threatName = 'Security Anomaly';
    let attackType = 'Unclassified Vector';
    let threatActor = 'Unattributed Actor';
    let summary = event.details;

    if (features.privilegeElevationFlag && features.processParentChildAnomaly) {
      threatName = 'Privilege Escalation via Token Impersonation';
      attackType = 'SeImpersonate Token Stealing / Potato Exploit';
      threatActor = 'Active Adversary (Post-Exploitation)';
      confidence = 95;
      summary = `Low-privileged process on ${event.destination} invoked named pipe impersonation to acquire elevated SYSTEM privileges.`;
    } else if (features.failedLoginBurstCount >= 5) {
      if (features.untrustedAsnScore > 0.8) {
        threatName = 'Credential Attack';
        attackType = 'Credential Stuffing & Kerberoasting Vector';
        threatActor = 'UNC-2452 / APT Affiliate Pattern';
        confidence = 94;
        summary = `Multiple failed Kerberos pre-authentication attempts from ${event.sourceIp} targeting ${event.destination}.`;
      } else {
        threatName = 'Brute Force Login Surge';
        attackType = 'Distributed Password Spraying & Brute Force';
        threatActor = 'Botnet Cluster';
        confidence = 91;
        summary = `Sustained authentication attempts detected against ${event.destination}.`;
      }
    } else if (features.lateralSmbFlag) {
      threatName = 'Lateral Movement via Remote WMI';
      attackType = 'Remote WMI Execution & Admin Share Abuse';
      threatActor = 'Internal Pivoting Actor';
      confidence = 91;
      summary = `Remote execution commands observed from ${event.sourceIp} to ${event.destination}.`;
    } else if (features.egressVolumeMb > 500) {
      threatName = 'Unusual Encrypted Egress Spike';
      attackType = 'Anomalous High-Volume Outbound Data Stream';
      threatActor = 'Automated Data Extraction Channel';
      confidence = 88;
      summary = `${features.egressVolumeMb} MB of anomalous outbound egress detected from ${event.destination}.`;
    } else if (event.category === 'Network Connection' && event.event.toLowerCase().includes('scan')) {
      threatName = 'Suspicious Reconnaissance Scan';
      attackType = 'Automated Vulnerability Sweep & Port Probing';
      threatActor = 'Anonymous Scanner';
      confidence = 88;
      summary = `Systematic port probing detected against ${event.destination} from ${event.sourceIp}.`;
    } else if (riskScore < 40) {
      isThreat = false;
      threatName = 'Baseline Telemetry';
      attackType = 'Standard Operational Activity';
      threatActor = 'Internal Authorized Service';
      confidence = 90;
      summary = 'Routine benign telemetry within expected operational baselines.';
    }

    let risk: RiskLevel = 'LOW';
    if (riskScore >= 85) {
      risk = 'CRITICAL';
    } else if (riskScore >= 70) {
      risk = 'HIGH';
    } else if (riskScore >= 45) {
      risk = 'MEDIUM';
    }

    return {
      isThreat,
      threatName,
      attackType,
      risk,
      riskScore,
      confidence,
      threatActor,
      summary,
    };
  }
}
