import { Router } from 'express';
import ingredientRoute from './ingredient.route';
import recipeRoute from './recipe.route';
import pricingRoute from './pricing.route';
import modifierRoute from './modifier.route';
import promotionRoute from './promotion.route';
import orderRoute from './order.route';
import ocrRoute from './ocr.route';
import reportRoute from './report.route';
import settingsRoute from './settings.route';

const router = Router();

router.get('/isAlive', (_req, res) => {
	res.status(200).json({ alive: true, at: new Date().toISOString() });
});

router.use('/ingredients', ingredientRoute);
router.use('/recipes', recipeRoute);
router.use('/pricing', pricingRoute);
router.use('/modifiers', modifierRoute);
router.use('/promotions', promotionRoute);
router.use('/orders', orderRoute);
router.use('/ocr', ocrRoute);
router.use('/reports', reportRoute);
router.use('/settings', settingsRoute);

export default router;
