import { Request, Response } from 'express';
import { threatService } from '../services/threatService';
import { ExplainabilityService } from '../services/ai/explainabilityService';
import { NormalizationService } from '../services/ai/normalization';
import { FeatureExtractionService } from '../services/ai/featureExtractor';

export const getThreatExplainability = async (req: Request, res: Response) => {
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
      contributingFactors: threat.contributingFactors,
      plainLanguageExplanation: threat.plainLanguageExplanation,
      riskScore: threat.riskScore,
      confidence: threat.confidence,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const explainCustomEvent = async (req: Request, res: Response) => {
  try {
    const rawPayload = req.body;
    const normalized = NormalizationService.normalize(rawPayload);
    const features = FeatureExtractionService.extractFeatures(normalized);
    const explanation = ExplainabilityService.generateExplanation(
      normalized,
      features,
      rawPayload.threatName || 'Custom Threat Scenario'
    );

    res.status(200).json({
      success: true,
      data: explanation,
      features,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
