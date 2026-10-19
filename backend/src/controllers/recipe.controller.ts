import { Request, Response } from 'express';
import knex from 'knex';
import { dbConf } from '../config/db.config';
import recipeService from '../services/recipe.service';
import socket from '../models/socket';
import { RecipeInput } from '../interfaces/recipe';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

export const list = async (_req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const [recipes, categories] = await Promise.all([
			recipeService.listRecipes(db),
			recipeService.listCategories(db)
		]);
		res.status(200).json({ recipes, categories });
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
		const recipe = await recipeService.getRecipeDetail(db, id);
		if (!recipe) return throwGenericError(res, 'Receta no encontrada', null, 404);
		res.status(200).json({ recipe });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

const save = async (req: Request, res: Response, id?: number) => {
	const db = knex(dbConf());
	try {
		const body = req.body as RecipeInput;
		if (await recipeService.findByName(db, body.name, id)) {
			return throwGenericError(res, `Ya existe una receta llamada "${body.name}"`, null, 409);
		}
		const subIds = body.items.map((i) => i.sub_recipe_id).filter((s): s is number => !!s);
		const cycle = await recipeService.findCycle(db, id || null, subIds);
		if (cycle) return throwGenericError(res, `"${cycle}" ya usa esta receta; se formaría un ciclo`, null, 409);
		const recipeId = await recipeService.saveRecipe(db, body, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id: recipeId, recipe: await recipeService.getRecipeDetail(db, recipeId) });
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

export const duplicate = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		if (await recipeService.findByName(db, req.body.name)) {
			return throwGenericError(res, `Ya existe una receta llamada "${req.body.name}"`, null, 409);
		}
		const newId = await recipeService.duplicateRecipe(db, id, req.body.name.trim());
		socket.emit('catalog:changed');
		res.status(200).json({ id: newId });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const setActive = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await recipeService.setActive(db, id, req.body.active);
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
		const usage = await recipeService.usage(db, id);
		if (usage.as_component) {
			return throwGenericError(res, `Se usa como componente en ${usage.as_component} receta(s)`, usage, 409);
		}
		if (usage.in_orders) {
			await recipeService.setActive(db, id, 0);
			socket.emit('catalog:changed');
			return res.status(200).json({ id, deactivated: true });
		}
		await recipeService.deleteRecipe(db, id);
		socket.emit('catalog:changed');
		res.status(200).json({ id, deleted: true });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { list, get, create, update, duplicate, setActive, remove };
