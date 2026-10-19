import { Router } from 'express';
import controller from '../controllers/modifier.controller';
import { verifyModifierGroup } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.list);
router.post('/', verifyModifierGroup, controller.create);
router.put('/:id', verifyModifierGroup, controller.update);
router.delete('/:id', controller.remove);

export default router;
