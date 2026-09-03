import { Request, Response } from 'express';
import { threatService } from '../services/threatService';
import { ForecastingService } from '../services/ai/forecastingService';
import { AttackStageId } from '../types';

export const getThreatForecast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const threat = await threatService.getThreatById(id);
    if (!threat) {
      return res.status(404).json({ success: false, message: `Threat ${id} not found` });
    }

    res.status(200).json({
      success: true,
      threatId: threat.id,
      threatName: threat.name,
      currentStage: threat.currentStage,
      currentStageId: threat.currentStageId,
      nextLikelyStage: threat.nextLikelyStage,
      nextLikelyProbability: threat.nextLikelyProbability,
      forecastTimeline: threat.forecastTimeline,
      engine: 'SentinelFlow Markov-Transformer Pipeline v1.2',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const predictCustomProgression = async (req: Request, res: Response) => {
  try {
    const { currentStageId, riskScore, threatName } = req.body;
    if (!currentStageId) {
      return res.status(400).json({ success: false, message: 'currentStageId is required' });
    }

    const forecast = ForecastingService.forecastProgression(
      currentStageId as AttackStageId,
      riskScore || 80,
      threatName || 'Simulated Threat'
    );

    res.status(200).json({
      success: true,
      data: forecast,
      engine: 'SentinelFlow Markov-Transformer Pipeline v1.2',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
