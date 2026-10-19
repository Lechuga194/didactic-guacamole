import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import pricingService from '../services/pricing.service';
import recipeService from '../services/recipe.service';
import settingsService from '../services/settings.service';
import socket from '../models/socket';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

export const table = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const [rows, channels, settings] = await Promise.all([
			pricingService.pricingTable(db),
			settingsService.listChannels(db, true),
			settingsService.getSettings(db)
		]);
		res.status(200).json({ rows, channels, settings });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const setPrice = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const { recipe_id, channel_id, price } = req.body;
		await recipeService.upsertPrice(db, recipe_id, channel_id, price);
		socket.emit('catalog:changed');
		res.status(200).json({ recipe_id, channel_id, price });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const savePrices = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const changed = await pricingService.savePrices(db, req.body.changes);
		socket.emit('catalog:changed');
		res.status(200).json({ changed });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const applySuggested = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const changed = await pricingService.applySuggested(db, req.body.targets);
		socket.emit('catalog:changed');
		res.status(200).json({ changed });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const syncFromChannel = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const channel = await settingsService.getChannel(db, req.body.source_channel_id);
		if (!channel) return throwGenericError(res, 'Canal no encontrado', null, 404);
		if (!channel.is_platform) {
			return throwGenericError(res, 'El canal de origen debe ser una plataforma (no venta directa)', null, 400);
		}
		const result = await pricingService.syncFromChannel(db, channel.id);
		socket.emit('catalog:changed');
		res.status(200).json({ source: channel.name, ...result });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const getCheckpoint = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ checkpoint: await pricingService.getCheckpoint(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const saveCheckpoint = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ checkpoint: await pricingService.saveCheckpoint(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const history = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		res.status(200).json({ history: await pricingService.priceHistory(db, id) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { table, setPrice, savePrices, applySuggested, syncFromChannel, getCheckpoint, saveCheckpoint, history };
