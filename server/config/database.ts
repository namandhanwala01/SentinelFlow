import mongoose from 'mongoose';
import { config } from './env';
import { ThreatModel } from '../models/Threat';
import { MonitoredSystemModel } from '../models/MonitoredSystem';
import { SecurityEventModel } from '../models/SecurityEvent';
import { seedThreats, seedSystems, seedEvents } from '../seed/seedData';

export let isMongoConnected = false;

export async function connectDatabase(): Promise<boolean> {
  if (!config.mongodbUri) {
    console.warn('[Database] MONGODB_URI not configured. Using SentinelFlow High-Performance In-Memory store.');
    isMongoConnected = false;
    return false;
  }

  // Setup connection event listeners
  mongoose.connection.on('connected', () => {
    isMongoConnected = true;
    console.log('[Database] 🟢 Mongoose connection active.');
  });

  mongoose.connection.on('disconnected', () => {
    isMongoConnected = false;
    console.warn('[Database] 🟡 Mongoose disconnected.');
  });

  mongoose.connection.on('error', (err) => {
    isMongoConnected = false;
    console.error('[Database] 🔴 Mongoose connection error:', err.message);
  });

  try {
    const isAtlas = config.mongodbUri.includes('mongodb+srv://');
    console.log(`[Database] Attempting connection to MongoDB ${isAtlas ? 'Atlas Cloud Cluster' : 'Instance'}...`);
    mongoose.set('strictQuery', false);

    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority',
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
      `[Database] To use live MongoDB Atlas, set MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/sentinelflow in .env.`
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
