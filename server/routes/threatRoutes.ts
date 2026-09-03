import { Router } from 'express';
import {
  getThreats,
  getThreatById,
  updateThreatStatus,
  getMetrics,
} from '../controllers/threatController';

const router = Router();

router.get('/', getThreats);
router.get('/metrics', getMetrics);
router.get('/:id', getThreatById);
router.patch('/:id/status', updateThreatStatus);

export default router;
