import { Request, Response } from 'express';
import knex, { Knex } from 'knex';
import { dbConf } from '../config/db.config';
import orderService from '../services/order.service';
import recipeService from '../services/recipe.service';
import settingsService from '../services/settings.service';
import modifierService from '../services/modifier.service';
import promotionService from '../services/promotion.service';
import socket from '../models/socket';
import { OrderFilters, OrderInput, OrderItemRow } from '../interfaces/order';
import { serverError, throwGenericError, toId } from '../utils/error.utils';

/** Calcula el pedido con costos actuales (o históricos si se edita). */
const compute = async (db: Knex, input: OrderInput, previous?: Map<number, OrderItemRow>) => {
	const [channel, settings, ctx, options] = await Promise.all([
		settingsService.getChannel(db, input.channel_id),
		settingsService.getSettings(db),
		recipeService.loadCostContext(db),
		orderService.allModifierOptions(db)
	]);
	if (!channel) return null;
	return orderService.computeOrder(input, channel, settings, ctx, options, previous);
};

export const formData = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const ctx = await recipeService.loadCostContext(db);
		const [channels, settings, groups, promotions, prices, favorites] = await Promise.all([
			settingsService.listChannels(db, true),
			settingsService.getSettings(db),
			modifierService.listGroups(db, ctx),
			promotionService.listPromotions(db),
			db('recipe_prices').select('recipe_id', 'channel_id', 'price'),
			orderService.favoriteRecipes(db, toId(req.query.channel_id))
		]);
		const products = ctx.recipes
			.filter((r) => r.active && r.kind !== 'preparacion')
			.map((r) => ({
				id: r.id,
				name: r.name,
				kind: r.kind,
				category: r.category,
				cost: recipeService.costOf(ctx, r.id).unit,
				prices: Object.fromEntries(
					prices
						.filter((p: { recipe_id: number }) => p.recipe_id === r.id)
						.map((p: { channel_id: number; price: number }) => [p.channel_id, p.price])
				)
			}))
			.sort((a, b) => a.name.localeCompare(b.name, 'es'));
		res.status(200).json({
			channels,
			settings,
			products,
			modifier_groups: groups,
			promotions: promotions.filter((p) => p.active),
			favorites
		});
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const list = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		res.status(200).json({ orders: await orderService.listOrders(db, req.query as OrderFilters) });
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
		const order = await orderService.getOrder(db, id);
		if (!order) return throwGenericError(res, 'Pedido no encontrado', null, 404);
		res.status(200).json({ order });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

/** Calcula totales y utilidad sin guardar (vista previa en vivo del formulario). */
export const preview = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const orderId = toId(req.query.order_id);
		const previous = orderId ? await orderService.previousItems(db, orderId) : undefined;
		const result = await compute(db, req.body, previous);
		if (!result) return throwGenericError(res, 'Canal no encontrado', null, 400);
		res.status(200).json(result);
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const create = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const result = await compute(db, req.body);
		if (!result) return throwGenericError(res, 'Canal no encontrado', null, 400);
		const id = await orderService.saveOrder(db, req.body, result);
		socket.emit('orders:changed', { id, action: 'create' });
		res.status(200).json({ id, totals: result.totals });
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
		if (!(await orderService.getOrderRow(db, id))) return throwGenericError(res, 'Pedido no encontrado', null, 404);
		const result = await compute(db, req.body, await orderService.previousItems(db, id));
		if (!result) return throwGenericError(res, 'Canal no encontrado', null, 400);
		await orderService.saveOrder(db, req.body, result, id);
		socket.emit('orders:changed', { id, action: 'update' });
		res.status(200).json({ id, totals: result.totals });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export const setStatus = async (req: Request, res: Response) => {
	const db = knex(dbConf());
	try {
		const id = toId(req.params.id);
		if (!id) return throwGenericError(res, 'Id inválido', null, 400);
		await orderService.setStatus(db, id, req.body.status);
		socket.emit('orders:changed', { id, action: 'status' });
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
		await orderService.deleteOrder(db, id);
		socket.emit('orders:changed', { id, action: 'delete' });
		res.status(200).json({ id });
	} catch (error) {
		serverError(res, error);
	} finally {
		await db.destroy();
	}
};

export default { formData, list, get, preview, create, update, setStatus, remove };
