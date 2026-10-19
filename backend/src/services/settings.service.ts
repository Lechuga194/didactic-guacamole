import { Knex } from 'knex';
import { AppSettings, Channel, ChannelInput, FixedExpense, FixedExpenseInput } from '../interfaces/settings';

const NUMERIC_KEYS: (keyof AppSettings)[] = [
	'iva_rate',
	'target_margin_pct',
	'food_cost_target_pct',
	'price_rounding',
	'daily_sales_goal',
	'daily_profit_goal',
	'backup_keep'
];

export const getSettings = async (db: Knex): Promise<AppSettings> => {
	const rows: { key: string; value: string }[] = await db('settings').select('key', 'value');
	const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
	const out: Record<string, unknown> = { ...map };
	for (const k of NUMERIC_KEYS) out[k] = Number(map[k] ?? 0);
	return out as unknown as AppSettings;
};

export const updateSettings = async (db: Knex, values: Partial<AppSettings>): Promise<void> => {
	await db.transaction(async (trx) => {
		for (const [key, value] of Object.entries(values)) {
			await trx('settings')
				.insert({ key, value: String(value) })
				.onConflict('key')
				.merge({ value: String(value) });
		}
	});
};

export const listChannels = async (db: Knex, onlyActive = false): Promise<Channel[]> => {
	const q = db('channels').select('*').orderBy('sort_order').orderBy('id');
	if (onlyActive) q.where({ active: 1 });
	return q;
};

export const getChannel = async (db: Knex, id: number): Promise<Channel | undefined> =>
	db('channels').where({ id }).first();

export const createChannel = async (db: Knex, data: ChannelInput): Promise<number> => {
	const [id] = await db('channels').insert(data);
	return id;
};

export const updateChannel = async (db: Knex, id: number, data: Partial<ChannelInput>): Promise<void> => {
	await db('channels').where({ id }).update(data);
};

export const channelHasOrders = async (db: Knex, id: number): Promise<boolean> =>
	!!(await db('orders').where({ channel_id: id }).first('id'));

export const deleteChannel = async (db: Knex, id: number): Promise<void> => {
	await db('channels').where({ id }).delete();
};

export const listExpenses = async (db: Knex): Promise<FixedExpense[]> =>
	db('fixed_expenses').select('*').orderBy('active', 'desc').orderBy('name');

export const createExpense = async (db: Knex, data: FixedExpenseInput): Promise<number> => {
	const [id] = await db('fixed_expenses').insert(data);
	return id;
};

export const updateExpense = async (db: Knex, id: number, data: Partial<FixedExpenseInput>): Promise<void> => {
	await db('fixed_expenses').where({ id }).update(data);
};

export const deleteExpense = async (db: Knex, id: number): Promise<void> => {
	await db('fixed_expenses').where({ id }).delete();
};

export default {
	getSettings,
	updateSettings,
	listChannels,
	getChannel,
	createChannel,
	updateChannel,
	channelHasOrders,
	deleteChannel,
	listExpenses,
	createExpense,
	updateExpense,
	deleteExpense
};
