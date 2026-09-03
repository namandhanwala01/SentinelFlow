import { AttackStageId, ForecastStage } from '../../types';

export class ForecastingService {
  /**
   * Generates sequence attack progression forecasts, next likely stage probability,
   * escalation time windows, and proactive containment indicators.
   */
  public static forecastProgression(
    currentStageId: AttackStageId,
    riskScore: number,
    threatName: string
  ): {
    nextLikelyStage: string;
    nextLikelyProbability: number;
    timeline: ForecastStage[];
  } {
    let nextLikelyStage = 'Credential Access';
    let nextLikelyProbability = 75;

    // Transition probabilities based on current stage
    switch (currentStageId) {
      case 'reconnaissance':
        nextLikelyStage = 'Initial Access';
        nextLikelyProbability = Math.min(85, Math.round(riskScore * 0.9));
        break;
      case 'initial-access':
        nextLikelyStage = 'Credential Access';
        nextLikelyProbability = Math.min(92, Math.round(riskScore * 0.92));
        break;
      case 'execution':
        nextLikelyStage = 'Privilege Escalation';
        nextLikelyProbability = Math.min(88, Math.round(riskScore * 0.88));
        break;
      case 'privilege-escalation':
        nextLikelyStage = 'Lateral Movement';
        nextLikelyProbability = Math.min(94, Math.round(riskScore * 0.94));
        break;
      case 'credential-access':
        nextLikelyStage = 'Lateral Movement';
        nextLikelyProbability = Math.min(89, Math.round(riskScore * 0.90));
        break;
      case 'lateral-movement':
        nextLikelyStage = 'Exfiltration';
        nextLikelyProbability = Math.min(92, Math.round(riskScore * 0.91));
        break;
      case 'exfiltration':
        nextLikelyStage = 'Exfiltration';
        nextLikelyProbability = 95;
        break;
      default:
        nextLikelyStage = 'Execution';
        nextLikelyProbability = 70;
    }

    const timeline: ForecastStage[] = [
      {
        stageId: 'credential-access',
        stageName: 'Credential Access (Kerberoasting / Dump)',
        probability: Math.min(95, nextLikelyProbability),
        estimatedTimeWindow: '10–20 mins',
        indicators: ['TGS-REQ ticket queries for SPN accounts', 'RC4 ticket encryption downgrade request'],
        confidence: 91,
        recommendedPreemptiveAction: 'Rotate all Kerberos service account keys and enforce AES-256 cipher.',
      },
      {
        stageId: 'execution',
        stageName: 'Remote Execution & Discovery',
        probability: Math.max(30, nextLikelyProbability - 14),
        estimatedTimeWindow: '30–60 mins',
        indicators: ['Encoded PowerShell execution flags (-enc)', 'LDAP query bursts'],
        confidence: 84,
        recommendedPreemptiveAction: 'Enable PowerShell Constrained Language Mode and ScriptBlock logging.',
      },
      {
        stageId: 'lateral-movement',
        stageName: 'Lateral Propagation to Core Infrastructure',
        probability: Math.max(25, nextLikelyProbability - 26),
        estimatedTimeWindow: '1–2 hours',
        indicators: ['SMB connection attempts to adjacent subnets', 'Pass-the-Hash artifact'],
        confidence: 76,
        recommendedPreemptiveAction: 'Enforce micro-segmentation firewall rules isolating management ports.',
      },
      {
        stageId: 'exfiltration',
        stageName: 'Data Archive & Staged Egress',
        probability: Math.max(15, nextLikelyProbability - 40),
        estimatedTimeWindow: '2–6 hours',
        indicators: ['Volume Shadow Copy snapshot creation', 'Outbound TLS connection to external fast-flux IP'],
        confidence: 68,
        recommendedPreemptiveAction: 'Block unauthorized outbound egress on non-standard ports.',
      },
    ];

    return {
      nextLikelyStage,
      nextLikelyProbability,
      timeline,
    };
  }
}
