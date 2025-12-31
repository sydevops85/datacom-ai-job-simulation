import { Router } from 'express';
import { 
  getAllKudos, 
  hideKudos, 
  deleteKudos, 
  getModerationLogs 
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/kudos', authenticate, authorize(['admin']), getAllKudos);
router.patch('/kudos/:id/hide', authenticate, authorize(['admin']), hideKudos);
router.delete('/kudos/:id', authenticate, authorize(['admin']), deleteKudos);
router.get('/moderation-logs', authenticate, authorize(['admin']), getModerationLogs);

export default router;
