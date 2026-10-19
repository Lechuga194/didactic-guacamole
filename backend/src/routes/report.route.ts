import { Router } from 'express';
import controller from '../controllers/report.controller';
import { verifyDate, verifyRange } from '../middleware/validation.middleware';

const router = Router();

router.get('/day', verifyDate, controller.day);
router.get('/dashboard', verifyRange, controller.dashboard);
router.get('/alerts', controller.alerts);

export default router;
