import { Router } from 'express';
import { createKudos, getKudosFeed, getKudosById } from '../controllers/kudos.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createKudos);
router.get('/feed', getKudosFeed);
router.get('/:id', getKudosById);

export default router;
