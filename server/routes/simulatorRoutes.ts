import { Router } from 'express';
import {
  getScenarios,
  triggerScenario,
  generateBatch,
} from '../controllers/simulatorController';

const router = Router();

router.get('/scenarios', getScenarios);
router.post('/trigger', triggerScenario);
router.post('/batch', generateBatch);

export default router;
