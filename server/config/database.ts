import mongoose from 'mongoose';
import { config } from './env';
import { ThreatModel } from '../models/Threat';
import { MonitoredSystemModel } from '../models/MonitoredSystem';
import { SecurityEventModel } from '../models/SecurityEvent';
import { seedThreats, seedSystems, seedEvents } from '../seed/seedData';

export let isMongoConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (!config.mongodbUri) {
    console.warn('[Database] MONGODB_URI not configured. Using in-memory fallback store.');
    isMongoConnected = false;
    return false;
  }

  try {
    console.log(`[Database] Attempting connection to MongoDB (${config.mongodbUri})...`);
    mongoose.set('strictQuery', false);

    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    isMongoConnected = true;
    console.log('[Database] ✅ Connected to MongoDB successfully.');

    // Seed database if empty
    await seedDatabaseIfEmpty();
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.warn(
      `[Database] ⚠️ MongoDB connection could not be established (${error.message}).\n` +
      `[Database] Initializing SentinelFlow High-Performance In-Memory Store as safe fallback.\n` +
      `[Database] To use live MongoDB, verify your local mongod service or update MONGODB_URI in .env.`
    );
    return false;
  }
}

async function seedDatabaseIfEmpty() {
  try {
    const threatCount = await ThreatModel.countDocuments();
    if (threatCount === 0) {
      console.log('[Database] Seeding initial Threat register into MongoDB...');
      await ThreatModel.insertMany(seedThreats);
    }

    const systemCount = await MonitoredSystemModel.countDocuments();
    if (systemCount === 0) {
      console.log('[Database] Seeding initial Monitored Systems into MongoDB...');
      await MonitoredSystemModel.insertMany(seedSystems);
    }

    const eventCount = await SecurityEventModel.countDocuments();
    if (eventCount === 0) {
      console.log('[Database] Seeding initial Security Events telemetry into MongoDB...');
      await SecurityEventModel.insertMany(seedEvents);
    }

    console.log('[Database] ✅ MongoDB data verification/seeding completed.');
  } catch (seedErr: any) {
    console.error('[Database] Seeding warning:', seedErr.message);
  }
}
