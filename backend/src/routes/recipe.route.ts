import { Router } from 'express';
import controller from '../controllers/recipe.controller';
import { verifyActive, verifyDuplicate, verifyRecipe } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.list);
router.post('/', verifyRecipe, controller.create);
router.get('/:id', controller.get);
router.put('/:id', verifyRecipe, controller.update);
router.post('/:id/duplicate', verifyDuplicate, controller.duplicate);
router.patch('/:id/active', verifyActive, controller.setActive);
router.patch('/:id/reviewed', controller.markReviewed);
router.delete('/:id', controller.remove);

export default router;
