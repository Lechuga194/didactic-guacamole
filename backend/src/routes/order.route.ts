import { Router } from 'express';
import controller from '../controllers/order.controller';
import { verifyOrder, verifyOrderFilters, verifyStatus } from '../middleware/order.middleware';

const router = Router();

router.get('/', verifyOrderFilters, controller.list);
router.get('/form-data', controller.formData);
router.post('/preview', verifyOrder, controller.preview);
router.post('/', verifyOrder, controller.create);
router.get('/:id', controller.get);
router.put('/:id', verifyOrder, controller.update);
router.patch('/:id/status', verifyStatus, controller.setStatus);
router.delete('/:id', controller.remove);

export default router;
