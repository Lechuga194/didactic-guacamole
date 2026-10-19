import { Knex } from 'knex';
import { DraftItem, DraftModifier, OrderDraft, ParsedItem, ParsedReceipt } from '../interfaces/ocr';
import { ModifierGroup, ModifierOption } from '../interfaces/modifier';
import recipeService, { CostContext } from './recipe.service';
import modifierService from './modifier.service';
import orderService from './order.service';
import settingsService from './settings.service';
import matchUtils, { MatchCandidate } from '../utils/match.utils';
import { normalize, tokens } from '../utils/text.utils';
import pricingUtils from '../utils/pricing.utils';

interface Catalog {
	ctx: CostContext;
	groups: ModifierGroup[];
	options: ModifierOption[];
	aliases: Map<string, number>;
	products: MatchCandidate[];
	combos: MatchCandidate[];
}

const similarGroup = (a: string, b: string): boolean => {
	const ta = tokens(a);
	const tb = tokens(b);
	if (!ta.length || !tb.length) return false;
	const common = ta.filter((t) => tb.includes(t)).length;
	return common / Math.max(ta.length, tb.length) >= 0.5;
};

/** Busca la opción del catálogo que corresponde a un modificador leído del ticket. */
const resolveModifier = (
	cat: Catalog,
	groupName: string | null,
	name: string
): { option: ModifierOption | null; group: ModifierGroup | null } => {
	const byName = cat.options.filter((o) => normalize(o.name) === normalize(name));
	const groupOf = (o: ModifierOption) => cat.groups.find((g) => g.id === o.group_id) || null;
	if (byName.length) {
		const inGroup = groupName ? byName.find((o) => similarGroup(groupOf(o)?.name || '', groupName)) : undefined;
		const option = inGroup || byName[0];
		return { option, group: groupOf(option) };
	}
	const group = groupName ? cat.groups.find((g) => similarGroup(g.name, groupName)) || null : null;
	return { option: null, group };
};

const buildItem = (cat: Catalog, item: ParsedItem, combo: boolean): DraftItem => {
	const variantNames: string[] = [];
	const modifiers: DraftModifier[] = item.modifiers.map((m) => {
		const { option, group } = resolveModifier(cat, m.group_name, m.name);
		// Si el grupo no está en el catálogo se asume que define la variante (ayuda a elegir la receta)
		if (!group || group.defines_variant) variantNames.push(m.name);
		return {
			modifier_option_id: option?.id ?? null,
			group_name: group?.name ?? m.group_name,
			name: option?.name ?? m.name,
			quantity: m.quantity || 1,
			price_delta: m.price,
			cost_delta: option ? pricingUtils.round2(modifierService.optionCost(option, cat.ctx)) : 0
		};
	});
	const candidates = combo ? [...cat.combos, ...cat.products] : cat.products;
	const match = matchUtils.bestMatch(item.name, variantNames, candidates, cat.aliases);
	const recipeName = match.recipe_id ? candidates.find((c) => c.id === match.recipe_id)?.name || null : null;
	const qty = item.quantity || 1;
	return {
		raw_name: item.name,
		recipe_id: match.recipe_id,
		recipe_name: recipeName,
		confidence: match.confidence,
		alias_key: matchUtils.aliasKey(item.name, variantNames),
		name: recipeName || item.name,
		quantity: qty,
		unit_price: pricingUtils.round2(item.price / qty),
		modifiers,
		children: item.children.map((c) => buildItem(cat, c, false)),
		candidates: match.candidates
	};
};

/** Convierte el ticket interpretado en un borrador de pedido con recetas sugeridas. */
export const buildDraft = async (db: Knex, parsed: ParsedReceipt, rawText: string): Promise<OrderDraft> => {
	const [ctx, groups, options, aliases, channels] = await Promise.all([
		recipeService.loadCostContext(db),
		db('modifier_groups').select('*') as Promise<ModifierGroup[]>,
		orderService.allModifierOptions(db),
		orderService.loadAliases(db),
		settingsService.listChannels(db)
	]);
	const sellable = ctx.recipes.filter((r) => r.active && r.kind !== 'preparacion');
	const cat: Catalog = {
		ctx,
		groups,
		options,
		aliases,
		products: sellable.filter((r) => r.kind === 'producto_final').map((r) => ({ id: r.id, name: r.name })),
		combos: sellable.filter((r) => r.kind === 'combo').map((r) => ({ id: r.id, name: r.name }))
	};
	const channel = parsed.channel_code ? channels.find((c) => c.code === parsed.channel_code) : undefined;
	const warnings = [...parsed.warnings];
	const items = parsed.items.map((it) => buildItem(cat, it, it.is_combo));
	const unmatched = items.flatMap((i) => [i, ...i.children]).filter((i) => !i.recipe_id).length;
	if (unmatched) warnings.push(`${unmatched} producto(s) no se reconocieron; elige la receta correspondiente`);
	if (parsed.commission_pct !== null && channel && Math.abs(parsed.commission_pct - channel.commission_pct) > 0.001) {
		warnings.push(
			`El ticket indica comisión de ${(parsed.commission_pct * 100).toFixed(0)}% y ${channel.name} está configurado en ${(channel.commission_pct * 100).toFixed(0)}%`
		);
	}
	return {
		channel_id: channel?.id ?? null,
		channel_code: parsed.channel_code,
		ordered_at: parsed.ordered_at,
		external_ref: parsed.external_ref,
		items,
		discount_store: parsed.discount_store || 0,
		subtotal: parsed.subtotal,
		commission_amount: parsed.commission_amount,
		commission_pct: parsed.commission_pct,
		reported_payout: parsed.payout,
		warnings,
		raw_text: rawText
	};
};

export default { buildDraft };
