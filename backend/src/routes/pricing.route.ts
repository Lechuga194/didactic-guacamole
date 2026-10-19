import { Router } from 'express';
import controller from '../controllers/pricing.controller';
import {
	verifyApplySuggested,
	verifyBulkPrices,
	verifyPrice,
	verifySyncPrices
} from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.table);
router.put('/price', verifyPrice, controller.setPrice);
router.put('/prices', verifyBulkPrices, controller.savePrices);
router.post('/apply-suggested', verifyApplySuggested, controller.applySuggested);
router.post('/sync', verifySyncPrices, controller.syncFromChannel);
router.get('/checkpoint', controller.getCheckpoint);
router.put('/checkpoint', controller.saveCheckpoint);
router.get('/:id/history', controller.history);

export default router;
