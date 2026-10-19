import { Router } from 'express';
import controller from '../controllers/settings.controller';
import { verifyChannel, verifyExpense, verifySettings } from '../middleware/catalog.middleware';

const router = Router();

router.get('/', controller.getAll);
router.put('/', verifySettings, controller.updateSettings);
router.post('/channels', verifyChannel, controller.createChannel);
router.put('/channels/:id', verifyChannel, controller.updateChannel);
router.delete('/channels/:id', controller.deleteChannel);
router.post('/expenses', verifyExpense, controller.createExpense);
router.put('/expenses/:id', verifyExpense, controller.updateExpense);
router.delete('/expenses/:id', controller.deleteExpense);
router.get('/backups', controller.listBackups);
router.post('/backups', controller.createBackup);
router.get('/export', controller.exportExcel);

export default router;
