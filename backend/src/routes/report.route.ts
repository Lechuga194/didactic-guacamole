import { Router } from 'express';
import controller from '../controllers/report.controller';
import { verifyDate, verifyRange } from '../middleware/validation.middleware';
import { verifyHideAlerts } from '../middleware/catalog.middleware';

const router = Router();

router.get('/day', verifyDate, controller.day);
router.get('/dashboard', verifyRange, controller.dashboard);
router.get('/alerts', controller.alerts);
router.put('/alerts/hidden', verifyHideAlerts, controller.hideAlerts);

export default router;
