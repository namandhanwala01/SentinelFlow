import { RawEventInput, NormalizationService } from './normalization';
import { FeatureExtractionService } from './featureExtractor';
import { ThreatDetectionService } from './threatDetector';
import { StageIdentificationService } from './stageIdentifier';
import { ForecastingService } from './forecastingService';
import { ExplainabilityService } from './explainabilityService';
import { WhatIfSimulationEngine } from './whatIfEngine';
import { RecommendationEngine } from './recommendationEngine';
import { Threat, SecurityEvent } from '../../types';

export interface PipelineExecutionResult {
  rawEvent: RawEventInput;
  normalizedEvent: SecurityEvent;
  isThreat: boolean;
  threat?: Threat;
  analysisSummary: string;
}

export class ThreatPipeline {
  /**
   * Complete end-to-end SentinelFlow AI pipeline execution
   * Detect → Investigate → Understand → Forecast → Explain → Simulate Defense → Recommend Action
   */
  public static processEvent(rawInput: RawEventInput): PipelineExecutionResult {
    // 1. Normalization
    const normalized = NormalizationService.normalize(rawInput);

    // 2. Feature Extraction
    const features = FeatureExtractionService.extractFeatures(normalized);

    // 3. Threat Detection & Risk Scoring
    const detection = ThreatDetectionService.detectThreat(normalized, features);

    if (!detection.isThreat) {
      const securityEvent = NormalizationService.toSecurityEvent(normalized);
      return {
        rawEvent: rawInput,
        normalizedEvent: securityEvent,
        isThreat: false,
        analysisSummary: 'Event processed: Baseline operational telemetry within normal thresholds.',
      };
    }

    // 4. Attack Stage Identification (MITRE ATT&CK 8 stages)
    const stageInfo = StageIdentificationService.identifyStages(
      normalized,
      features,
      detection.threatName
    );

    // 5. Forecasting
    const forecast = ForecastingService.forecastProgression(
      stageInfo.currentStageId,
      detection.riskScore,
      detection.threatName
    );

    // 6. Explainability
    const explain = ExplainabilityService.generateExplanation(
      normalized,
      features,
      detection.threatName
    );

    // 7. What-if Simulated Actions
    const simulatedActions = WhatIfSimulationEngine.DEFAULT_COUNTERMEASURES;

    // 8. Recommendations
    const threatId = `THREAT-${Date.now().toString().slice(-4)}`;
    const recommendations = RecommendationEngine.generateRecommendations(
      threatId,
      detection.threatName,
      normalized.destination,
      detection.risk,
      detection.riskScore
    );

    const securityEvent = NormalizationService.toSecurityEvent(normalized, threatId);

    const threat: Threat = {
      id: threatId,
      name: detection.threatName,
      risk: detection.risk,
      riskScore: detection.riskScore,
      confidence: detection.confidence,
      currentStage: stageInfo.currentStageName,
      currentStageId: stageInfo.currentStageId,
      nextLikelyStage: forecast.nextLikelyStage,
      nextLikelyProbability: forecast.nextLikelyProbability,
      firstDetected: normalized.timestamp,
      lastSeen: 'Just now (live)',
      affectedSystem: normalized.destination,
      affectedSystemIp: normalized.destinationIp,
      sourceIp: normalized.sourceIp,
      threatActor: detection.threatActor,
      status: 'Active',
      attackType: detection.attackType,
      summary: detection.summary,
      stages: stageInfo.stages,
      forecastTimeline: forecast.timeline,
      contributingFactors: explain.contributingFactors,
      plainLanguageExplanation: explain.plainLanguageExplanation,
      simulatedActions,
      recommendations,
      relatedEventIds: [securityEvent.id],
    };

    return {
      rawEvent: rawInput,
      normalizedEvent: securityEvent,
      isThreat: true,
      threat,
      analysisSummary: `Threat detected: ${threat.name} on ${threat.affectedSystem} (${threat.riskScore}/100 ${threat.risk}). Predicted next stage: ${threat.nextLikelyStage} (${threat.nextLikelyProbability}%).`,
    };
  }
}
