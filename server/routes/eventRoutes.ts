import { Router } from 'express';
import { getEvents, getEventById, ingestEvent } from '../controllers/eventController';

const router = Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/ingest', ingestEvent);

export default router;
