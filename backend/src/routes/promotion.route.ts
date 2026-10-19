import { Router } from 'express';
import controller from '../controllers/promotion.controller';
import { verifyPromotion } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.list);
router.post('/', verifyPromotion, controller.create);
router.put('/:id', verifyPromotion, controller.update);
router.delete('/:id', controller.remove);

export default router;
