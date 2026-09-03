import mongoose, { Schema, Document } from 'mongoose';
import { ForecastStage } from '../types';

export interface ForecastDocument extends Document {
  threatId: string;
  threatName: string;
  currentStage: string;
  predictedStage: string;
  probability: number;
  confidence: number;
  timeline: ForecastStage[];
  generatedAt: Date;
  modelEngine: string;
}

const ForecastSchema = new Schema(
  {
    threatId: { type: String, required: true, index: true },
    threatName: { type: String, required: true },
    currentStage: { type: String, required: true },
    predictedStage: { type: String, required: true },
    probability: { type: Number, required: true },
    confidence: { type: Number, required: true },
    timeline: [
      {
        stageId: { type: String, required: true },
        stageName: { type: String, required: true },
        probability: { type: Number, required: true },
        estimatedTimeWindow: { type: String, required: true },
        indicators: [{ type: String }],
        confidence: { type: Number, required: true },
        recommendedPreemptiveAction: { type: String, required: true },
      },
    ],
    generatedAt: { type: Date, default: Date.now },
    modelEngine: { type: String, default: 'SentinelFlow Markov-Transformer Pipeline v1.2' },
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

export const ForecastModel = mongoose.model<ForecastDocument>('Forecast', ForecastSchema);
