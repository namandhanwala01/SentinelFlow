import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sentinelflow',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  aiForecastSensitivity: parseFloat(process.env.AI_FORECAST_SENSITIVITY || '0.75'),
  aiMinConfidenceThreshold: parseFloat(process.env.AI_MIN_CONFIDENCE_THRESHOLD || '0.60'),
  simulatorTickIntervalMs: parseInt(process.env.SIMULATOR_TICK_INTERVAL_MS || '3000', 10),
};
