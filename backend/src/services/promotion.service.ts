import { Knex } from 'knex';
import { Promotion, PromotionDetail, PromotionInput } from '../interfaces/promotion';

export const listPromotions = async (db: Knex): Promise<PromotionDetail[]> => {
	const [promos, links, usage] = await Promise.all([
		db('promotions').select('*').orderBy('active', 'desc').orderBy('name') as Promise<Promotion[]>,
		db('promotion_recipes').select('*') as Promise<{ promotion_id: number; recipe_id: number }[]>,
		db('order_promotions as op')
			.join('orders as o', 'o.id', 'op.order_id')
			.where('o.status', 'completado')
			.whereNotNull('op.promotion_id')
			.groupBy('op.promotion_id')
			.select(
				'op.promotion_id',
				db.raw('COUNT(*) AS times_used'),
				db.raw('SUM(op.store_amount) AS store_cost')
			) as Promise<{ promotion_id: number; times_used: number; store_cost: number }[]>
	]);
	return promos.map((p) => {
		const u = usage.find((x) => x.promotion_id === p.id);
		return {
			...p,
			recipe_ids: links.filter((l) => l.promotion_id === p.id).map((l) => l.recipe_id),
			times_used: Number(u?.times_used || 0),
			store_cost: Number(u?.store_cost || 0)
		};
	});
};

export const savePromotion = async (db: Knex, data: PromotionInput, id?: number): Promise<number> =>
	db.transaction(async (trx) => {
		const { recipe_ids, ...row } = data;
		let promoId = id;
		if (promoId) await trx('promotions').where({ id: promoId }).update(row);
		else [promoId] = await trx('promotions').insert(row);
		await trx('promotion_recipes').where({ promotion_id: promoId }).delete();
		if (recipe_ids.length) {
			await trx('promotion_recipes').insert(recipe_ids.map((r) => ({ promotion_id: promoId, recipe_id: r })));
		}
		return promoId as number;
	});

export const deletePromotion = async (db: Knex, id: number): Promise<void> => {
	await db('promotions').where({ id }).delete();
};

export default { listPromotions, savePromotion, deletePromotion };
