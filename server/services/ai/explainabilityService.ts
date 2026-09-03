import { ContributingFactor } from '../../types';
import { SecurityFeatureVector } from './featureExtractor';
import { NormalizedSecurityEvent } from './normalization';

export class ExplainabilityService {
  /**
   * Computes feature importance weights (summing to 100%) and natural language analyst narrative
   */
  public static generateExplanation(
    event: NormalizedSecurityEvent,
    features: SecurityFeatureVector,
    threatName: string
  ): {
    contributingFactors: ContributingFactor[];
    plainLanguageExplanation: string;
  } {
    const factors: ContributingFactor[] = [];

    if (features.failedLoginBurstCount > 0) {
      factors.push({
        id: 'cf-auth',
        name: 'Authentication Anomaly / Burst Rate',
        category: 'Behavioral Anomaly',
        weight: 38,
        description: `Rapid cluster of ${features.failedLoginBurstCount} failed logon attempts within a short timeframe.`,
        evidence: `Event ID 4625 recorded against user "${event.user}" from source IP ${event.sourceIp}.`,
      });
    }

    if (features.untrustedAsnScore > 0.5) {
      factors.push({
        id: 'cf-geo',
        name: 'Untrusted Ingress Geolocation & ASN Reputation',
        category: 'Threat Intelligence',
        weight: 28,
        description: `Ingress IP address (${event.sourceIp}) belongs to a bulletproof hosting or proxy provider.`,
        evidence: `Threat intelligence feeds score source IP ${event.sourceIp} at high risk.`,
      });
    }

    if (features.privilegeElevationFlag) {
      factors.push({
        id: 'cf-priv',
        name: 'Privilege Token Escalation Indicator',
        category: 'Identity Risk',
        weight: 22,
        description: 'Process observed elevating to NT AUTHORITY\\SYSTEM or root context.',
        evidence: `Privileged token manipulation recorded on host ${event.destination}.`,
      });
    }

    if (features.offHoursAnomaly > 0.5) {
      factors.push({
        id: 'cf-time',
        name: 'Off-Hours Administrative Usage',
        category: 'Behavioral Anomaly',
        weight: 12,
        description: 'Activity detected outside standard operational maintenance hours.',
        evidence: `Timestamp ${event.timestamp} falls outside scheduled operational windows.`,
      });
    }

    if (factors.length === 0) {
      factors.push({
        id: 'cf-baseline',
        name: 'Baseline Statistical Variance',
        category: 'Behavioral Anomaly',
        weight: 100,
        description: 'Event parameters deviate from historical moving averages.',
        evidence: `Telemetry event on ${event.destination} evaluated against fleet baseline.`,
      });
    }

    // Normalize weights to sum exactly to 100
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    factors.forEach((f) => {
      f.weight = Math.round((f.weight / totalWeight) * 100);
    });

    const plainLanguageExplanation = `SentinelFlow flagged "${threatName}" on asset ${event.destination} (${event.destinationIp}). Analysis of telemetry reveals abnormal ingress from ${event.sourceIp}, high-weight behavioral anomalies, and indicators consistent with active MITRE ATT&CK progression. Proactive defensive containment is recommended.`;

    return {
      contributingFactors: factors,
      plainLanguageExplanation,
    };
  }
}
