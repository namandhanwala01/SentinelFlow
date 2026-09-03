import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import apiRouter from './routes';

const app = express();

// Enable CORS
app.use(
  cors({
    origin: '*', // Allow all origins for dev/testing or specify config.corsOrigin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;
  _res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${method} ${url} ${_res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api/v1', apiRouter);

// Root fallback status
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'SentinelFlow AI — Cyber Threat Intelligence & Forecasting API',
    status: 'Operational',
    docs: '/api/v1/health',
    version: '1.0.0',
  });
});

// 404 Handler for API
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} not found on SentinelFlow API.`,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: config.nodeEnv === 'development' ? err.stack : undefined,
  });
});

// Start Server & Connect Database
async function startServer() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`==================================================`);
    console.log(`🛡️  SENTINELFLOW AI BACKEND SERVICE ONLINE`);
    console.log(`📡  Listening on port ${config.port} (http://localhost:${config.port})`);
    console.log(`🔗  API Base: http://localhost:${config.port}/api/v1`);
    console.log(`💡  Environment: ${config.nodeEnv}`);
    console.log(`==================================================`);
  });

  // Graceful shutdown handling
  const gracefulShutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    server.close(() => {
      console.log('[Server] Closed remaining HTTP connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

startServer().catch((err) => {
  console.error('[Fatal Startup Error]:', err);
  process.exit(1);
});

export default app;
