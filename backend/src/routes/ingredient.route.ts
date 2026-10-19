import { Router } from 'express';
import controller from '../controllers/ingredient.controller';
import { verifyBulkCosts, verifyIngredient, verifyIngredientPatch } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.list);
router.post('/', verifyIngredient, controller.create);
router.put('/bulk-costs', verifyBulkCosts, controller.bulkCosts);
router.get('/:id', controller.get);
router.put('/:id', verifyIngredient, controller.update);
router.patch('/:id', verifyIngredientPatch, controller.update);
router.delete('/:id', controller.remove);

export default router;
