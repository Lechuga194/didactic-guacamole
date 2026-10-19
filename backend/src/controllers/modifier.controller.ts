import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import modifierService from '../services/modifier.service';
import socket from '../models/socket';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

export const list = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ groups: await modifierService.listGroups(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

const save = async (req: Request, res: Response, id?: number) => {
	const db = knex(dbConf());
	try {
		if (await modifierService.findGroupByName(db, req.body.name, id)) {
			return throwGenericError(res, `Ya existe un grupo llamado "${req.body.name}"`, null, 409);
		}
		const names = req.body.options.map((o: { name: string }) => o.name.trim().toLowerCase());
		if (new Set(names).size !== names.length) return throwGenericError(res, 'Hay opciones repetidas en el grupo');
		const groupId = await modifierService.saveGroup(db, req.body, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id: groupId });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const create = async (req: Request, res: Response) => save(req, res);

export const update = async (req: Request, res: Response) => {
	const id = toId(req.params.id);
	if (!id) return throwGenericError(res, 'Id inválido', null, 400);
	return save(req, res, id);
};

export const remove = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await modifierService.deleteGroup(db, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { list, create, update, remove };
