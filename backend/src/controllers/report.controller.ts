import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import reportService from '../services/report.service';
import socket from '../models/socket';
import dateUtils from '../utils/date.utils';
import { serverError, throwGenericError } from '../utils/error.utils';

export const day = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const date = (req.query.date as string) || dateUtils.today();
		res.status(200).json({ summary: await reportService.daySummary(db, date) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const dashboard = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const { from, to } = req.query as { from: string; to: string };
		if (from > to) return throwGenericError(res, 'La fecha inicial es posterior a la final', null, 400);
		if (dateUtils.daysBetween(from, to) > 400)
			return throwGenericError(res, 'El rango máximo es de 400 días', null, 400);
		res.status(200).json({ dashboard: await reportService.dashboard(db, from, to) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const alerts = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ alerts: await reportService.alerts(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const hideAlerts = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const changed = await reportService.setAlertsHidden(db, req.body.keys, req.body.hidden);
		socket.emit('catalog:changed');
		res.status(200).json({ changed });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { day, dashboard, alerts, hideAlerts };
