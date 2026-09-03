import { NormalizedSecurityEvent } from './normalization';

export interface SecurityFeatureVector {
  failedLoginBurstCount: number;
  untrustedAsnScore: number;
  portDiversityCount: number;
  privilegeElevationFlag: number; // 0 or 1
  offHoursAnomaly: number; // 0.0 to 1.0
  egressVolumeMb: number;
  ja4AnomalyScore: number; // 0.0 to 1.0
  lateralSmbFlag: number; // 0 or 1
  processParentChildAnomaly: number; // 0 or 1
  overallFeatureScore: number;
}

export class FeatureExtractionService {
  /**
   * Extracts quantitative behavioral and telemetry features from normalized events
   */
  public static extractFeatures(event: NormalizedSecurityEvent, recentEvents: NormalizedSecurityEvent[] = []): SecurityFeatureVector {
    let failedLoginBurstCount = 0;
    let untrustedAsnScore = 0;
    let portDiversityCount = 1;
    let privilegeElevationFlag = 0;
    let offHoursAnomaly = 0.2;
    let egressVolumeMb = 0;
    let ja4AnomalyScore = 0.1;
    let lateralSmbFlag = 0;
    let processParentChildAnomaly = 0;

    const allEvents = [event, ...recentEvents];
    const eventTime = new Date(event.timestamp.replace(' ', 'T'));
    const hour = isNaN(eventTime.getHours()) ? 23 : eventTime.getHours();

    // Check off-hours (between 20:00 and 06:00)
    if (hour >= 20 || hour < 6) {
      offHoursAnomaly = 0.85;
    }

    // Evaluate IP reputation heuristics
    if (
      event.sourceIp.startsWith('194.26.') ||
      event.sourceIp.startsWith('45.142.') ||
      event.sourceIp.startsWith('185.220.')
    ) {
      untrustedAsnScore = 0.95;
    } else if (event.sourceIp.startsWith('10.') || event.sourceIp.startsWith('192.168.')) {
      untrustedAsnScore = 0.05;
    } else {
      untrustedAsnScore = 0.50;
    }

    // Evaluate authentication bursts
    const authFailures = allEvents.filter(
      (e) => e.category === 'Authentication' && (e.status === 'failed' || e.details.includes('failed'))
    );
    failedLoginBurstCount = authFailures.length;
    if (event.rawPayload?.failure_count) {
      failedLoginBurstCount = Math.max(failedLoginBurstCount, event.rawPayload.failure_count);
    }

    // Check privilege anomalies
    if (
      event.category === 'Privilege' ||
      event.details.toLowerCase().includes('seimpersonate') ||
      event.details.toLowerCase().includes('system') ||
      event.details.toLowerCase().includes('admin')
    ) {
      privilegeElevationFlag = 1;
    }

    // Check lateral movement indicators
    if (
      event.details.toLowerCase().includes('wmi') ||
      event.details.toLowerCase().includes('psexec') ||
      event.details.toLowerCase().includes('smb') ||
      event.details.toLowerCase().includes('c$')
    ) {
      lateralSmbFlag = 1;
    }

    // Check process anomalies
    if (
      event.rawPayload?.parent_process === 'w3wp.exe' &&
      event.rawPayload?.child_process === 'cmd.exe'
    ) {
      processParentChildAnomaly = 1;
    }

    // Check egress volume
    if (event.rawPayload?.bytes_sent) {
      egressVolumeMb = Math.round(event.rawPayload.bytes_sent / (1024 * 1024));
    }

    if (event.rawPayload?.ja4_fingerprint) {
      ja4AnomalyScore = 0.92;
    }

    // Calculate composite feature score (0 to 100)
    let score = 0;
    score += Math.min(30, failedLoginBurstCount * 5);
    score += untrustedAsnScore * 25;
    score += privilegeElevationFlag * 35;
    score += lateralSmbFlag * 25;
    score += processParentChildAnomaly * 30;
    score += Math.min(25, egressVolumeMb / 100);
    score += offHoursAnomaly * 15;

    const overallFeatureScore = Math.min(100, Math.max(10, Math.round(score)));

    return {
      failedLoginBurstCount,
      untrustedAsnScore,
      portDiversityCount,
      privilegeElevationFlag,
      offHoursAnomaly,
      egressVolumeMb,
      ja4AnomalyScore,
      lateralSmbFlag,
      processParentChildAnomaly,
      overallFeatureScore,
    };
  }
}
