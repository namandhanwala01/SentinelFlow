import mongoose, { Schema, Document } from 'mongoose';
import { MonitoredSystem as IMonitoredSystem } from '../types';

export interface MonitoredSystemDocument extends Omit<IMonitoredSystem, 'id'>, Document {
  id: string;
}

const MonitoredSystemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    ip: { type: String, default: '10.0.0.1' },
    ipAddress: { type: String, default: '10.0.0.1' },
    type: {
      type: String,
      enum: [
        'Domain Controller',
        'Database Server',
        'Workstation',
        'Web Server',
        'File Server',
        'Cloud Gateway',
        'Mail Server',
      ],
      required: true,
    },
    os: { type: String, required: true },
    status: {
      type: String,
      enum: ['Healthy', 'At Risk', 'Critical'],
      required: true,
      index: true,
    },
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    activeThreatsCount: { type: Number, default: 0 },
    lastSeen: { type: String, required: true },
    assignedThreatId: { type: String },
    agentVersion: { type: String, default: 'v4.2.1-prod' },
    environment: {
      type: String,
      enum: ['Production', 'Staging', 'Corporate', 'DMZ'],
      default: 'Production',
    },
    department: { type: String, default: 'Core Infrastructure' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete (ret as any)._id;
        delete (ret as any).__v;
        if (!ret.ipAddress && ret.ip) ret.ipAddress = ret.ip;
        if (!ret.ip && ret.ipAddress) ret.ip = ret.ipAddress;
        return ret;
      },
    },
  }
);

export const MonitoredSystemModel = mongoose.model<MonitoredSystemDocument>(
  'MonitoredSystem',
  MonitoredSystemSchema
);
