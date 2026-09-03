import mongoose, { Schema, Document } from 'mongoose';
import { SimulatedAction } from '../types';

export interface SimulationResultDocument extends Document {
  threatId?: string;
  baselineRiskScore: number;
  projectedRiskScore: number;
  totalRiskReductionPercent: number;
  appliedActions: SimulatedAction[];
  simulatedAt: Date;
}

const SimulationResultSchema = new Schema(
  {
    threatId: { type: String, index: true },
    baselineRiskScore: { type: Number, required: true },
    projectedRiskScore: { type: Number, required: true },
    totalRiskReductionPercent: { type: Number, required: true },
    appliedActions: [
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
    ],
    simulatedAt: { type: Date, default: Date.now },
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

export const SimulationResultModel = mongoose.model<SimulationResultDocument>(
  'SimulationResult',
  SimulationResultSchema
);
