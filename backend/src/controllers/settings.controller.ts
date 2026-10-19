import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import settingsService from '../services/settings.service';
import backupService from '../services/backup.service';
import exportService from '../services/export.service';
import socket from '../models/socket';
import { serverError, throwGenericError, toId } from '../utils/error.utils';
import dateUtils from '../utils/date.utils';

export const getAll = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const [settings, channels, expenses] = await Promise.all([
			settingsService.getSettings(db),
			settingsService.listChannels(db),
			settingsService.listExpenses(db)
		]);
		res.status(200).json({ settings, channels, expenses });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const updateSettings = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		await settingsService.updateSettings(db, req.body);
		socket.emit('settings:changed');
		res.status(200).json({ settings: await settingsService.getSettings(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const createChannel = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = await settingsService.createChannel(db, req.body);
		socket.emit('settings:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const updateChannel = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await settingsService.updateChannel(db, id, req.body);
		socket.emit('settings:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const deleteChannel = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		if (await settingsService.channelHasOrders(db, id)) {
			return throwGenericError(
				res,
				'El canal tiene ventas registradas; desactívalo en lugar de borrarlo',
				null,
				409
			);
		}
		await settingsService.deleteChannel(db, id);
		socket.emit('settings:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const createExpense = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = await settingsService.createExpense(db, req.body);
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const updateExpense = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await settingsService.updateExpense(db, id, req.body);
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const deleteExpense = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await settingsService.deleteExpense(db, id);
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const listBackups = async (_req: Request, res: Response) => {
	try {
		res.status(200).json({ backups: backupService.listBackups() });
	} catch (error) {
		serverError(res, error);
	}
};

export const createBackup = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const settings = await settingsService.getSettings(db);
		const file = await backupService.createBackup(db, settings.backup_keep || 30);
		res.status(200).json({ file, backups: backupService.listBackups() });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const exportExcel = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const to = (req.query.to as string) || dateUtils.today();
		const from = (req.query.from as string) || dateUtils.addDays(to, -29);
		const buffer = await exportService.buildWorkbook(db, from, to);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', `attachment; filename="cocina_${from}_a_${to}.xlsx"`);
		res.status(200).send(buffer);
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default {
	getAll,
	updateSettings,
	createChannel,
	updateChannel,
	deleteChannel,
	createExpense,
	updateExpense,
	deleteExpense,
	listBackups,
	createBackup,
	exportExcel
};
