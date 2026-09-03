import { SimulatedAction, SimulationResponse } from '../../types';

export class WhatIfSimulationEngine {
  public static readonly DEFAULT_COUNTERMEASURES: SimulatedAction[] = [
    {
      id: 'block_ip',
      name: 'Block Ingress IP at Perimeter Firewall',
      description: 'Drop all inbound TCP/UDP traffic from adversary IP at perimeter firewalls.',
      category: 'Network',
      riskReductionPercent: 64,
      predictedRiskScore: 31,
      impactAnalysis: 'Low operational disruption. Eliminates active adversary connection channel without affecting internal systems.',
      recommendationText: 'Apply perimeter block rule on border firewalls.',
    },
    {
      id: 'isolate_host',
      name: 'Network-Isolate Affected Host',
      description: 'Sever all network connections except SentinelFlow EDR management tunnel to stop lateral expansion.',
      category: 'Host',
      riskReductionPercent: 88,
      predictedRiskScore: 10,
      impactAnalysis: 'High containment efficacy. Secondary redundant services will take over traffic.',
      recommendationText: 'Perform EDR micro-isolation on affected host.',
    },
    {
      id: 'reset_creds',
      name: 'Revoke Active Tokens & Force Credential Reset',
      description: 'Invalidate all active Kerberos TGTs / OAuth sessions and rotate passwords.',
      category: 'Identity',
      riskReductionPercent: 72,
      predictedRiskScore: 24,
      impactAnalysis: 'Zero legitimate user disruption if service accounts are refreshed sequentially.',
      recommendationText: 'Immediately reset target account credentials and flush token cache.',
    },
    {
      id: 'enable_mfa',
      name: 'Enforce Step-Up Conditional MFA',
      description: 'Require hardware / FIDO2 MFA tokens for all subsequent interactive authentication.',
      category: 'Policy',
      riskReductionPercent: 55,
      predictedRiskScore: 39,
      impactAnalysis: 'Nullifies password-only replay and credential stuffing attacks.',
      recommendationText: 'Mandate hardware MFA across all administrative access routes.',
    },
    {
      id: 'block_lateral_smb',
      name: 'Block Inter-VLAN Lateral SMB (Port 445)',
      description: 'Prevent application VLAN from initiating direct SMB/RDP connections to DB tier.',
      category: 'Network',
      riskReductionPercent: 78,
      predictedRiskScore: 20,
      impactAnalysis: 'Halts Pass-the-Hash and remote administrative share lateral traversal.',
      recommendationText: 'Apply internal firewall rule blocking cross-VLAN SMB traffic.',
    },
  ];

  /**
   * Evaluates defensive what-if simulation with diminishing returns
   */
  public static simulate(
    baselineRisk: number,
    selectedActionIds: string[],
    availableActions: SimulatedAction[] = this.DEFAULT_COUNTERMEASURES
  ): SimulationResponse {
    if (!selectedActionIds || selectedActionIds.length === 0) {
      return {
        baselineRiskScore: baselineRisk,
        projectedRiskScore: baselineRisk,
        totalRiskReductionPercent: 0,
        appliedActions: [],
        isSimulationOnly: true,
        disclaimer: 'Simulation only — no real infrastructure changes will be performed.',
        analysis: 'No defensive countermeasures applied. Risk remains at current baseline.',
      };
    }

    const appliedActions = availableActions.filter((a) => selectedActionIds.includes(a.id));

    if (appliedActions.length === 0) {
      return {
        baselineRiskScore: baselineRisk,
        projectedRiskScore: baselineRisk,
        totalRiskReductionPercent: 0,
        appliedActions: [],
        isSimulationOnly: true,
        disclaimer: 'Simulation only — no real infrastructure changes will be performed.',
        analysis: 'Selected action IDs did not match active countermeasure catalogue.',
      };
    }

    // Cumulative diminishing returns reduction calculation
    let remainingFactor = 1.0;
    appliedActions.forEach((action) => {
      const frac = action.riskReductionPercent / 100;
      remainingFactor *= 1 - frac * 0.85; // realistic diminishing overlap
    });

    const totalReductionFraction = Math.min(0.92, 1 - remainingFactor);
    const projectedRisk = Math.max(10, Math.round(baselineRisk * (1 - totalReductionFraction)));
    const totalReductionPercent = Math.round(((baselineRisk - projectedRisk) / baselineRisk) * 100);

    const analysis = `Applying ${appliedActions.length} defensive countermeasure(s) (${appliedActions.map((a) => a.name).join(', ')}) reduces projected risk from ${baselineRisk}/100 to ${projectedRisk}/100 (-${totalReductionPercent}% net containment).`;

    return {
      baselineRiskScore: baselineRisk,
      projectedRiskScore: projectedRisk,
      totalRiskReductionPercent: totalReductionPercent,
      appliedActions,
      isSimulationOnly: true,
      disclaimer: 'Simulation only — no real infrastructure changes will be performed.',
      analysis,
    };
  }
}
