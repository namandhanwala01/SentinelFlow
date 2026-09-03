import { Router } from 'express';
import threatRoutes from './threatRoutes';
import eventRoutes from './eventRoutes';
import systemRoutes from './systemRoutes';
import forecastRoutes from './forecastRoutes';
import explainabilityRoutes from './explainabilityRoutes';
import simulationRoutes from './simulationRoutes';
import recommendationRoutes from './recommendationRoutes';
import simulatorRoutes from './simulatorRoutes';

const apiRouter = Router();

apiRouter.use('/threats', threatRoutes);
apiRouter.use('/events', eventRoutes);
apiRouter.use('/systems', systemRoutes);
apiRouter.use('/forecast', forecastRoutes);
apiRouter.use('/explainability', explainabilityRoutes);
apiRouter.use('/simulate', simulationRoutes);
apiRouter.use('/recommendations', recommendationRoutes);
apiRouter.use('/simulator', simulatorRoutes);

// Healthcheck & System status
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'SentinelFlow AI Backend Core',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEngine: 'Active (Markov-Transformer v1.2)',
  });
});

export default apiRouter;
