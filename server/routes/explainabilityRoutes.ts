import { Router } from 'express';
import {
  getThreatExplainability,
  explainCustomEvent,
} from '../controllers/explainabilityController';

const router = Router();

router.get('/:id', getThreatExplainability);
router.post('/explain', explainCustomEvent);

export default router;
