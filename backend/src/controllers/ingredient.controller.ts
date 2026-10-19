import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import ingredientService from '../services/ingredient.service';
import socket from '../models/socket';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

export const list = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ ingredients: await ingredientService.listIngredients(db) });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const get = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		const ingredient = await ingredientService.getIngredient(db, id);
		if (!ingredient) return throwGenericError(res, 'Ingrediente no encontrado', null, 404);
		const [history, usedIn] = await Promise.all([
			ingredientService.costHistory(db, id),
			ingredientService.recipesUsing(db, id)
		]);
		res.status(200).json({ ingredient, history, used_in: usedIn });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const create = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		if (await ingredientService.findByName(db, req.body.name)) {
			return throwGenericError(res, `Ya existe un ingrediente llamado "${req.body.name}"`, null, 409);
		}
		const id = await ingredientService.createIngredient(db, req.body);
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
		const same = req.body.name ? await ingredientService.findByName(db, req.body.name) : undefined;
		if (same && same.id !== id)
			return throwGenericError(res, `Ya existe un ingrediente llamado "${req.body.name}"`, null, 409);
		await ingredientService.updateIngredient(db, id, req.body);
		socket.emit('catalog:changed');
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const bulkCosts = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const updated = await ingredientService.bulkUpdateCosts(db, req.body.changes);
		socket.emit('catalog:changed');
		res.status(200).json({ updated });
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
		const used = await ingredientService.recipesUsing(db, id);
		// Sin ?force=1 no se borra algo que está en recetas (la app pide confirmación y luego manda force)
		if (used.length && req.query.force !== '1') {
			return throwGenericError(
				res,
				`Se usa en ${used.length} receta(s); confirma para quitarlo de ellas`,
				used.map((u) => u.name),
				409
			);
		}
		const removedFrom = await ingredientService.deleteIngredient(db, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id, removed_from: used.map((u) => u.name), removed_items: removedFrom });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

/** Reemplaza el ingrediente por otro en todas las recetas y lo elimina. */
export const replaceAndRemove = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		const { replace_with_id: replacementId, factor } = req.body as { replace_with_id: number; factor: number };
		if (replacementId === id) return throwGenericError(res, 'El reemplazo debe ser otro ingrediente', null, 400);
		const [current, replacement] = await Promise.all([
			ingredientService.getIngredient(db, id),
			ingredientService.getIngredient(db, replacementId)
		]);
		if (!current) return throwGenericError(res, 'Ingrediente no encontrado', null, 404);
		if (!replacement) return throwGenericError(res, 'El ingrediente de reemplazo no existe', null, 404);
		const used = await ingredientService.recipesUsing(db, id);
		const changed = await ingredientService.replaceAndDelete(db, id, replacementId, factor);
		socket.emit('catalog:changed');
		res.status(200).json({
			id,
			replaced_with: replacement.name,
			recipes: [...new Set(used.map((u) => u.name))],
			changed_items: changed
		});
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { list, get, create, update, bulkCosts, remove, replaceAndRemove };
