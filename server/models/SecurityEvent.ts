import mongoose, { Schema, Document } from 'mongoose';
import { SecurityEvent as ISecurityEvent } from '../types';

export interface SecurityEventDocument extends Omit<ISecurityEvent, 'id'>, Document {
  id: string;
}

const SecurityEventSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, required: true, index: true },
    event: { type: String, required: true },
    source: { type: String, required: true },
    sourceIp: { type: String, required: true, index: true },
    destination: { type: String, required: true },
    destinationIp: { type: String },
    severity: {
      type: String,
      enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'],
      required: true,
      index: true,
    },
    category: { type: String, required: true, index: true },
    details: { type: String, required: true },
    threatId: { type: String, index: true },
    rawPayload: { type: Schema.Types.Mixed },
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

export const SecurityEventModel = mongoose.model<SecurityEventDocument>(
  'SecurityEvent',
  SecurityEventSchema
);
