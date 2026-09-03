import mongoose, { Schema, Document } from 'mongoose';
import { Threat as IThreat } from '../types';

export interface ThreatDocument extends Omit<IThreat, 'id'>, Document {
  id: string;
}

const AttackStageSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    status: {
      type: String,
      enum: ['completed', 'current', 'predicted', 'not-reached'],
      required: true,
    },
    timestamp: { type: String },
    confidence: { type: Number },
    mitreTechniqueId: { type: String },
    mitreTechniqueName: { type: String },
    description: { type: String, required: true },
    indicators: [{ type: String }],
    relatedEventsCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const ForecastStageSchema = new Schema(
  {
    stageId: { type: String, required: true },
    stageName: { type: String, required: true },
    probability: { type: Number, required: true },
    timeWindow: { type: String },
    estimatedTimeWindow: { type: String },
    keyIndicators: [{ type: String }],
    indicators: [{ type: String }],
    mitreRef: { type: String },
    confidenceInterval: { type: String },
    confidence: { type: Number },
    recommendedPreemptiveAction: { type: String },
  },
  {
    _id: false,
    toJSON: {
      transform: (_, ret) => {
        if (!ret.timeWindow && ret.estimatedTimeWindow) ret.timeWindow = ret.estimatedTimeWindow;
        if (!ret.estimatedTimeWindow && ret.timeWindow) ret.estimatedTimeWindow = ret.timeWindow;
        if (!ret.keyIndicators && ret.indicators) ret.keyIndicators = ret.indicators;
        if (!ret.indicators && ret.keyIndicators) ret.indicators = ret.keyIndicators;
        return ret;
      },
    },
  }
);

const ContributingFactorSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    weight: { type: Number, required: true },
    description: { type: String },
    evidence: { type: String, required: true },
  },
  { _id: false }
);

const SimulatedActionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    riskReductionPercent: { type: Number, required: true },
    predictedRiskScore: { type: Number, required: true },
    impactAnalysis: { type: String, required: true },
    recommendationText: { type: String, required: true },
  },
  { _id: false }
);

const RecommendationSchema = new Schema(
  {
    id: { type: String, required: true },
    priority: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, required: true },
    affectedAsset: { type: String, required: true },
    expectedBenefit: { type: String, required: true },
    actionCategory: { type: String },
    actionType: { type: String },
    suggestedTimeframe: { type: String },
    simulatedReduction: { type: Number },
  },
  { _id: false }
);

const ThreatSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    risk: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], required: true },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    currentStage: { type: String, required: true },
    currentStageId: { type: String, required: true },
    nextLikelyStage: { type: String, required: true },
    nextLikelyProbability: { type: Number, required: true, min: 0, max: 100 },
    firstDetected: { type: String, required: true },
    lastSeen: { type: String, required: true },
    affectedSystem: { type: String, required: true },
    affectedSystemIp: { type: String, required: true },
    sourceIp: { type: String, required: true },
    threatActor: { type: String },
    status: {
      type: String,
      enum: ['Active', 'Investigating', 'Contained', 'Resolved'],
      default: 'Active',
    },
    attackType: { type: String, required: true },
    summary: { type: String, required: true },
    stages: [AttackStageSchema],
    forecastTimeline: [ForecastStageSchema],
    contributingFactors: [ContributingFactorSchema],
    plainLanguageExplanation: { type: String, required: true },
    simulatedActions: [SimulatedActionSchema],
    recommendations: [RecommendationSchema],
    relatedEventIds: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

export const ThreatModel = mongoose.model<ThreatDocument>('Threat', ThreatSchema);
