import { Recommendation, RiskLevel } from '../../types';

export class RecommendationEngine {
  /**
   * Generates prioritized, actionable SOC remediation recommendations
   */
  public static generateRecommendations(
    threatId: string,
    threatName: string,
    affectedAsset: string,
    risk: RiskLevel,
    riskScore: number
  ): Recommendation[] {
    const recs: Recommendation[] = [];

    if (riskScore >= 80) {
      recs.push({
        id: `rec-${threatId}-1`,
        priority: 'Critical',
        action: `Revoke and Reset Compromised Credentials on ${affectedAsset}`,
        reason: `Target asset ${affectedAsset} exhibits elevated risk score (${riskScore}/100) with active exploitation signals.`,
        affectedAsset: `${affectedAsset} / IAM`,
        expectedBenefit: 'Terminates active adversary sessions; prevents reuse of compromised tokens.',
        actionCategory: 'IAM',
        actionType: 'Containment',
        suggestedTimeframe: '< 5 minutes',
        simulatedReduction: 75,
      });

      recs.push({
        id: `rec-${threatId}-2`,
        priority: 'Critical',
        action: `Isolate Asset ${affectedAsset} for Forensic Analysis`,
        reason: 'Prevent lateral expansion across corporate subnet while preserving volatile memory.',
        affectedAsset,
        expectedBenefit: 'Hard containment of adversary; halts data collection and lateral jump.',
        actionCategory: 'EDR',
        actionType: 'Containment',
        suggestedTimeframe: '< 10 minutes',
        simulatedReduction: 88,
      });
    }

    recs.push({
      id: `rec-${threatId}-3`,
      priority: 'High',
      action: 'Apply Dynamic Firewall Block for Ingress Threat Vector',
      reason: 'Sever ingress communication routes identified by threat correlation.',
      affectedAsset: 'Perimeter Firewalls',
      expectedBenefit: 'Blocks active command-and-control communication channel.',
      actionCategory: 'Firewall',
      actionType: 'Hardening',
      suggestedTimeframe: '< 1 hour',
      simulatedReduction: 64,
    });

    recs.push({
      id: `rec-${threatId}-4`,
      priority: 'Medium',
      action: 'Enable Enhanced Telemetry & ScriptBlock Logging',
      reason: 'Capture high-fidelity process execution artifacts and LDAP/WMI query sequences.',
      affectedAsset: `${affectedAsset} / SIEM`,
      expectedBenefit: 'Early detection of subsequent lateral movement or persistence scripts.',
      actionCategory: 'Monitoring',
      actionType: 'Investigation',
      suggestedTimeframe: '< 4 hours',
      simulatedReduction: 45,
    });

    return recs;
  }
}

