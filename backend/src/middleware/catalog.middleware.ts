import Joi from 'joi';
import { guard, pct, dateStr } from './validation.middleware';

const id = Joi.number().integer().positive();
const nullableId = id.allow(null);

export const verifyIngredient = guard(
	Joi.object({
		code: Joi.string().max(20).allow(null, ''),
		name: Joi.string().trim().min(1).max(120).required(),
		category: Joi.string().valid('insumo', 'empaque').required(),
		purchase_unit: Joi.string().valid('kg', 'L', 'pieza').required(),
		purchase_cost: Joi.number().min(0).required(),
		notes: Joi.string().max(500).allow(null, ''),
		active: Joi.number().valid(0, 1),
		price_volatile: Joi.number().valid(0, 1),
		needs_review: Joi.number().valid(0, 1),
		purchase_source: Joi.string().valid('linea', 'local')
	})
);

export const verifyIngredientPatch = guard(
	Joi.object({
		purchase_cost: Joi.number().min(0),
		active: Joi.number().valid(0, 1),
		category: Joi.string().valid('insumo', 'empaque'),
		notes: Joi.string().max(500).allow(null, ''),
		price_volatile: Joi.number().valid(0, 1),
		needs_review: Joi.number().valid(0, 1),
		purchase_source: Joi.string().valid('linea', 'local')
	}).min(1)
);

export const verifyReplaceIngredient = guard(
	Joi.object({
		replace_with_id: id.required(),
		factor: Joi.number().greater(0).max(10000).default(1)
	})
);

export const verifyBulkCosts = guard(
	Joi.object({
		changes: Joi.array()
			.items(Joi.object({ id: id.required(), purchase_cost: Joi.number().min(0).required() }))
			.min(1)
			.required()
	})
);

export const verifyRecipe = guard(
	Joi.object({
		name: Joi.string().trim().min(1).max(120).required(),
		kind: Joi.string().valid('preparacion', 'producto_final', 'combo').required(),
		category: Joi.string().max(60).allow(null, ''),
		yield_qty: Joi.number().greater(0).required(),
		yield_unit: Joi.string().valid('g', 'ml', 'pieza', 'oz').required(),
		notes: Joi.string().max(1000).allow(null, ''),
		active: Joi.number().valid(0, 1),
		items: Joi.array()
			.items(
				Joi.object({
					ingredient_id: nullableId,
					sub_recipe_id: nullableId,
					quantity: Joi.number().greater(0).required(),
					notes: Joi.string().max(200).allow(null, '')
				})
					// Exactamente uno de los dos. No se usa .xor() porque Joi cuenta null como presente.
					.custom((value: { ingredient_id?: number | null; sub_recipe_id?: number | null }, helpers) =>
						!!value.ingredient_id === !!value.sub_recipe_id ? helpers.error('any.invalid') : value
					)
					.messages({ 'any.invalid': 'Cada componente debe ser un ingrediente o una preparación (sólo uno)' })
			)
			.required(),
		modifier_group_ids: Joi.array().items(id),
		prices: Joi.array().items(Joi.object({ channel_id: id.required(), price: Joi.number().min(0).required() }))
	})
);

export const verifyDuplicate = guard(Joi.object({ name: Joi.string().trim().min(1).max(120).required() }));
export const verifyActive = guard(Joi.object({ active: Joi.number().valid(0, 1).required() }));

export const verifyPrice = guard(
	Joi.object({
		recipe_id: id.required(),
		channel_id: id.required(),
		price: Joi.number().min(0).allow(null).required()
	})
);

export const verifyBulkPrices = guard(
	Joi.object({
		changes: Joi.array()
			.items(
				Joi.object({
					recipe_id: id.required(),
					channel_id: id.required(),
					price: Joi.number().min(0).allow(null).required()
				})
			)
			.min(1)
			.required()
	})
);

export const verifyApplySuggested = guard(
	Joi.object({
		targets: Joi.array()
			.items(Joi.object({ recipe_id: id.required(), channel_id: id.required() }))
			.min(1)
			.required()
	})
);

export const verifyAcceptMargin = guard(
	Joi.object({
		items: Joi.array()
			.items(Joi.object({ recipe_id: id.required(), channel_id: id.required() }))
			.min(1)
			.required(),
		accepted: Joi.boolean().required()
	})
);

export const verifyHideAlerts = guard(
	Joi.object({
		keys: Joi.array().items(Joi.string().max(100)).min(1).required(),
		hidden: Joi.boolean().required()
	})
);

export const verifySyncPrices = guard(Joi.object({ source_channel_id: id.required() }));

export const verifyModifierGroup = guard(
	Joi.object({
		name: Joi.string().trim().min(1).max(80).required(),
		defines_variant: Joi.number().valid(0, 1).required(),
		notes: Joi.string().max(300).allow(null, ''),
		options: Joi.array()
			.items(
				Joi.object({
					id,
					name: Joi.string().trim().min(1).max(80).required(),
					price_delta: Joi.number().required(),
					ingredient_id: nullableId,
					sub_recipe_id: nullableId,
					quantity: Joi.number().min(0),
					fixed_cost: Joi.number().min(0),
					active: Joi.number().valid(0, 1)
				})
			)
			.required(),
		recipe_ids: Joi.array().items(id)
	})
);

export const verifyPromotion = guard(
	Joi.object({
		name: Joi.string().trim().min(1).max(100).required(),
		type: Joi.string()
			.valid('porcentaje', 'monto_fijo', '2x1', 'precio_especial', 'producto_gratis', 'otro')
			.required(),
		value: Joi.number().min(0).required(),
		absorbed_by: Joi.string().valid('tienda', 'plataforma', 'compartido').required(),
		store_share_pct: Joi.number().min(0).max(1).required(),
		channel_id: nullableId,
		starts_on: dateStr.allow(null, ''),
		ends_on: dateStr.allow(null, ''),
		notes: Joi.string().max(500).allow(null, ''),
		active: Joi.number().valid(0, 1).required(),
		recipe_ids: Joi.array().items(id).required()
	})
);

export const verifyChannel = guard(
	Joi.object({
		code: Joi.string()
			.trim()
			.lowercase()
			.pattern(/^[a-z0-9_-]+$/)
			.max(20)
			.required(),
		name: Joi.string().trim().min(1).max(40).required(),
		commission_pct: pct.required(),
		isr_ret_pct: pct.required(),
		iva_ret_pct: Joi.number().min(0).max(1).required(),
		target_margin_pct: pct.allow(null),
		is_platform: Joi.number().valid(0, 1).required(),
		color: Joi.string()
			.pattern(/^#[0-9a-fA-F]{6}$/)
			.required(),
		sort_order: Joi.number().integer().min(0).required(),
		active: Joi.number().valid(0, 1).required()
	})
);

export const verifySettings = guard(
	Joi.object({
		iva_rate: Joi.number().min(0).max(0.5),
		target_margin_pct: pct,
		food_cost_target_pct: pct,
		price_rounding: Joi.number().min(0).max(100),
		daily_sales_goal: Joi.number().min(0),
		daily_profit_goal: Joi.number().min(0),
		backup_keep: Joi.number().integer().min(1).max(365),
		business_name: Joi.string().trim().min(1).max(60),
		portal_url_didi: Joi.string()
			.trim()
			.uri({ scheme: ['https', 'http'] })
			.max(500),
		portal_url_uber: Joi.string()
			.trim()
			.uri({ scheme: ['https', 'http'] })
			.max(500),
		portal_url_rappi: Joi.string()
			.trim()
			.uri({ scheme: ['https', 'http'] })
			.max(500)
	}).min(1)
);

export const verifyExpense = guard(
	Joi.object({
		name: Joi.string().trim().min(1).max(80).required(),
		category: Joi.string().max(40).allow(null, ''),
		amount: Joi.number().min(0).required(),
		frequency: Joi.string().valid('diario', 'semanal', 'quincenal', 'mensual', 'anual').required(),
		notes: Joi.string().max(300).allow(null, ''),
		active: Joi.number().valid(0, 1).required()
	})
);

export default {
	verifyIngredient,
	verifyIngredientPatch,
	verifyReplaceIngredient,
	verifyBulkCosts,
	verifyRecipe,
	verifyDuplicate,
	verifyActive,
	verifyPrice,
	verifyBulkPrices,
	verifyApplySuggested,
	verifySyncPrices,
	verifyAcceptMargin,
	verifyHideAlerts,
	verifyModifierGroup,
	verifyPromotion,
	verifyChannel,
	verifySettings,
	verifyExpense
};
