import { Router } from 'express';
import { getSystems, getSystemById } from '../controllers/systemController';

const router = Router();

router.get('/', getSystems);
router.get('/:id', getSystemById);

export default router;
