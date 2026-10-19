import { Router } from 'express';
import controller from '../controllers/pricing.controller';
import { verifyApplySuggested, verifyPrice } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.table);
router.put('/price', verifyPrice, controller.setPrice);
router.post('/apply-suggested', verifyApplySuggested, controller.applySuggested);
router.get('/:id/history', controller.history);

export default router;
