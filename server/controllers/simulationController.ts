import { Request, Response } from 'express';
import { threatService } from '../services/threatService';
import { WhatIfSimulationEngine } from '../services/ai/whatIfEngine';
import { SimulationResultModel } from '../models/SimulationResult';
import { isMongoConnected } from '../config/database';

export const runSimulation = async (req: Request, res: Response) => {
  try {
    const { threatId, baseRiskScore, actionIds } = req.body;

    let baseline = baseRiskScore || 87;
    let availableActions = WhatIfSimulationEngine.DEFAULT_COUNTERMEASURES;

    if (threatId) {
      const threat = await threatService.getThreatById(threatId);
      if (threat) {
        baseline = threat.riskScore;
        if (threat.simulatedActions && threat.simulatedActions.length > 0) {
          availableActions = threat.simulatedActions;
        }
      }
    }

    const result = WhatIfSimulationEngine.simulate(baseline, actionIds || [], availableActions);

    // Save simulation audit record if Mongo is connected
    if (isMongoConnected) {
      try {
        await SimulationResultModel.create({
          threatId,
          baselineRiskScore: result.baselineRiskScore,
          projectedRiskScore: result.projectedRiskScore,
          totalRiskReductionPercent: result.totalRiskReductionPercent,
          appliedActions: result.appliedActions,
        });
      } catch (logErr: any) {
        // Non-blocking log error
      }
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
