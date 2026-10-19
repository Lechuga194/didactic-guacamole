import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import ocrService from '../services/ocr.service';
import draftService from '../services/draft.service';
import receiptParser from '../utils/receipt-parser.utils';
import { serverError, throwGenericError } from '../utils/error.utils';

/** Lee una captura de ticket y devuelve un borrador de pedido para revisar. */
export const scan = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		if (!req.file) return throwGenericError(res, 'Adjunta una imagen del ticket', null, 400);
		const page = await ocrService.recognize(req.file.buffer);
		const parsed = receiptParser.parseReceipt(page);
		const draft = await draftService.buildDraft(db, parsed, page.text);
		res.status(200).json({ draft });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { scan };
