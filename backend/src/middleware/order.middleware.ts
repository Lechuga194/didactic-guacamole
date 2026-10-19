import Joi from 'joi';
import { guard, dateStr, stampStr } from './validation.middleware';

const id = Joi.number().integer().positive();

const modifier = Joi.object({
	modifier_option_id: id.allow(null),
	group_name: Joi.string().max(80).allow(null, ''),
	name: Joi.string().trim().min(1).max(80).required(),
	quantity: Joi.number().greater(0),
	price_delta: Joi.number().required(),
	cost_delta: Joi.number().min(0)
});

const child = Joi.object({
	id,
	recipe_id: id.allow(null).required(),
	name: Joi.string().trim().min(1).max(120).required(),
	quantity: Joi.number().greater(0).required(),
	unit_price: Joi.number().min(0).required(),
	modifiers: Joi.array().items(modifier)
});

const item = child.keys({ children: Joi.array().items(child) });

export const verifyOrder = guard(
	Joi.object({
		channel_id: id.required(),
		ordered_at: stampStr.required(),
		external_ref: Joi.string().max(60).allow(null, ''),
		status: Joi.string().valid('completado', 'cancelado'),
		source: Joi.string().valid('manual', 'ocr'),
		notes: Joi.string().max(500).allow(null, ''),
		reported_payout: Joi.number().allow(null),
		items: Joi.array().items(item).min(1).required(),
		promotions: Joi.array().items(
			Joi.object({
				promotion_id: id.allow(null),
				description: Joi.string().trim().min(1).max(120).required(),
				type: Joi.string().max(30),
				store_amount: Joi.number().min(0).required(),
				platform_amount: Joi.number().min(0),
				item_indexes: Joi.array().items(Joi.number().integer().min(0))
			})
		),
		learn_aliases: Joi.array().items(
			Joi.object({ alias_key: Joi.string().max(300).required(), recipe_id: id.required() })
		)
	})
);

export const verifyOrderFilters = guard(
	Joi.object({
		from: dateStr,
		to: dateStr,
		channel_id: id,
		status: Joi.string().valid('completado', 'cancelado'),
		search: Joi.string().max(60).allow('')
	}),
	'query'
);

export const verifyStatus = guard(Joi.object({ status: Joi.string().valid('completado', 'cancelado').required() }));

export default { verifyOrder, verifyOrderFilters, verifyStatus };
