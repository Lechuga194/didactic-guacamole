import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import promotionService from '../services/promotion.service';
import socket from '../models/socket';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

const clean = (body: Record<string, unknown>) => ({
	...body,
	starts_on: body.starts_on || null,
	ends_on: body.ends_on || null,
	notes: body.notes || null
});

export const list = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ promotions: await promotionService.listPromotions(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const create = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = await promotionService.savePromotion(db, clean(req.body) as never);
		socket.emit('catalog:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const update = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await promotionService.savePromotion(db, clean(req.body) as never, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const remove = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await promotionService.deletePromotion(db, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { list, create, update, remove };
