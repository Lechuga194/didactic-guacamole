import { Router, Request, Response, NextFunction } from 'express';
import controller from '../controllers/ocr.controller';
import { ticketUpload } from '../middleware/multer.middleware';

const router = Router();

router.post(
	'/scan',
	(req: Request, res: Response, next: NextFunction) => {
		ticketUpload.single('image')(req, res, (err: unknown) => {
			if (err) return res.status(400).json({ error: (err as Error).message });
			next();
		});
	},
	controller.scan
);

export default router;
