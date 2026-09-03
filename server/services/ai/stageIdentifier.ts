import { AttackStage, AttackStageId } from '../../types';
import { NormalizedSecurityEvent } from './normalization';
import { SecurityFeatureVector } from './featureExtractor';

export class StageIdentificationService {
  private static readonly STAGES_METADATA: Array<{
    id: AttackStageId;
    name: string;
    order: number;
    mitreTechniqueId: string;
    mitreTechniqueName: string;
    defaultDesc: string;
  }> = [
    {
      id: 'reconnaissance',
      name: 'Reconnaissance',
      order: 1,
      mitreTechniqueId: 'T1595.002',
      mitreTechniqueName: 'Active Scanning: Vulnerability Scanning',
      defaultDesc: 'External host conducts port scanning and service discovery.',
    },
    {
      id: 'initial-access',
      name: 'Initial Access',
      order: 2,
      mitreTechniqueId: 'T1078.002',
      mitreTechniqueName: 'Valid Accounts: Domain Accounts',
      defaultDesc: 'Adversary gains initial foothold via credentials or exploit.',
    },
    {
      id: 'execution',
      name: 'Execution',
      order: 3,
      mitreTechniqueId: 'T1059.001',
      mitreTechniqueName: 'Command and Scripting Interpreter: PowerShell',
      defaultDesc: 'Execution of malicious commands or scripts on the host.',
    },
    {
      id: 'persistence',
      name: 'Persistence',
      order: 4,
      mitreTechniqueId: 'T1543.003',
      mitreTechniqueName: 'Create or Modify System Process: Windows Service',
      defaultDesc: 'Installation of scheduled tasks, run keys, or services.',
    },
    {
      id: 'privilege-escalation',
      name: 'Privilege Escalation',
      order: 5,
      mitreTechniqueId: 'T1134.001',
      mitreTechniqueName: 'Access Token Manipulation: Token Impersonation/Theft',
      defaultDesc: 'Abuse of tokens or exploits to elevate to SYSTEM / root.',
    },
    {
      id: 'credential-access',
      name: 'Credential Access',
      order: 6,
      mitreTechniqueId: 'T1558.003',
      mitreTechniqueName: 'Steal or Forge Kerberos Tickets: Kerberoasting',
      defaultDesc: 'Extraction of credentials from memory, NTDS.dit, or tickets.',
    },
    {
      id: 'lateral-movement',
      name: 'Lateral Movement',
      order: 7,
      mitreTechniqueId: 'T1021.002',
      mitreTechniqueName: 'Remote Services: SMB/Windows Admin Shares',
      defaultDesc: 'Spreading across subnets and adjacent servers.',
    },
    {
      id: 'exfiltration',
      name: 'Exfiltration',
      order: 8,
      mitreTechniqueId: 'T1048.002',
      mitreTechniqueName: 'Exfiltration Over Alternative Protocol',
      defaultDesc: 'Stealing and exfiltrating sensitive enterprise data.',
    },
  ];

  /**
   * Identifies current stage from event telemetry and builds the 8-stage MITRE kill chain array
   */
  public static identifyStages(
    event: NormalizedSecurityEvent,
    features: SecurityFeatureVector,
    threatType: string
  ): { currentStageId: AttackStageId; currentStageName: string; stages: AttackStage[] } {
    let currentStageId: AttackStageId = 'initial-access';

    if (features.egressVolumeMb > 500) {
      currentStageId = 'exfiltration';
    } else if (features.lateralSmbFlag) {
      currentStageId = 'lateral-movement';
    } else if (features.privilegeElevationFlag) {
      currentStageId = 'privilege-escalation';
    } else if (event.category === 'Process Execution') {
      currentStageId = 'execution';
    } else if (event.event.toLowerCase().includes('scan') || event.event.toLowerCase().includes('sweep')) {
      currentStageId = 'reconnaissance';
    } else {
      currentStageId = 'initial-access';
    }

    const currentOrder =
      this.STAGES_METADATA.find((s) => s.id === currentStageId)?.order || 2;

    const stages: AttackStage[] = this.STAGES_METADATA.map((meta) => {
      let status: 'completed' | 'current' | 'predicted' | 'not-reached' = 'not-reached';
      let confidence = 0;
      let timestamp: string | undefined = undefined;
      const indicators: string[] = [];

      if (meta.order < currentOrder) {
        status = 'completed';
        confidence = 90 + Math.floor(Math.random() * 8);
        timestamp = 'Prior observed activity';
        indicators.push(`Historical signals recorded for ${meta.name}`);
      } else if (meta.order === currentOrder) {
        status = 'current';
        confidence = 92 + Math.floor(Math.random() * 6);
        timestamp = event.timestamp.split(' ')[1] || 'Just now';
        indicators.push(event.event, `Observed from ${event.sourceIp}`);
      } else if (meta.order === currentOrder + 1 || (currentOrder === 2 && meta.id === 'credential-access')) {
        status = 'predicted';
        confidence = 65 + Math.floor(Math.random() * 20);
        indicators.push(`Anticipated next escalation step based on ${threatType}`);
      }

      return {
        id: meta.id,
        name: meta.name,
        order: meta.order,
        status,
        timestamp,
        confidence: confidence || undefined,
        mitreTechniqueId: meta.mitreTechniqueId,
        mitreTechniqueName: meta.mitreTechniqueName,
        description: meta.defaultDesc,
        indicators,
        relatedEventsCount: status === 'current' ? 3 : status === 'completed' ? 1 : 0,
      };
    });

    const currentStageName =
      this.STAGES_METADATA.find((s) => s.id === currentStageId)?.name || 'Initial Access';

    return {
      currentStageId,
      currentStageName,
      stages,
    };
  }
}
