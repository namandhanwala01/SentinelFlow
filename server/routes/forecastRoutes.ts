import { Router } from 'express';
import { getThreatForecast, predictCustomProgression } from '../controllers/forecastController';

const router = Router();

router.get('/:id', getThreatForecast);
router.post('/predict', predictCustomProgression);

export default router;
