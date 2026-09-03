import mongoose, { Schema, Document } from 'mongoose';
import { Recommendation as IRecommendation } from '../types';

export interface RecommendationDocument extends Document {
  threatId: string;
  recommendations: IRecommendation[];
  generatedAt: Date;
}

const RecommendationSchema = new Schema(
  {
    threatId: { type: String, required: true, index: true },
    recommendations: [
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
    ],
    generatedAt: { type: Date, default: Date.now },
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

export const RecommendationRecordModel = mongoose.model<RecommendationDocument>(
  'RecommendationRecord',
  RecommendationSchema
);
