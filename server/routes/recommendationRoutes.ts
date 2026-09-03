import { Router } from 'express';
import {
  getThreatRecommendations,
  generateRecommendations,
} from '../controllers/recommendationController';

const router = Router();

router.get('/:id', getThreatRecommendations);
router.post('/generate', generateRecommendations);

export default router;
