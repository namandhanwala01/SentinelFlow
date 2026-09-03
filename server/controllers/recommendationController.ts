import { Request, Response } from 'express';
import { threatService } from '../services/threatService';
import { RecommendationEngine } from '../services/ai/recommendationEngine';

export const getThreatRecommendations = async (req: Request, res: Response) => {
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
      recommendations: threat.recommendations,
      governanceNotice:
        'In accordance with enterprise change management guidelines, actions are not executed automatically and require authorization from certified SOC leads.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateRecommendations = async (req: Request, res: Response) => {
  try {
    const { threatId, threatName, affectedAsset, risk, riskScore } = req.body;
    const recs = RecommendationEngine.generateRecommendations(
      threatId || 'THREAT-MANUAL',
      threatName || 'Elevated Security Vector',
      affectedAsset || 'Target Asset',
      risk || 'HIGH',
      riskScore || 80
    );

    res.status(200).json({
      success: true,
      data: recs,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
