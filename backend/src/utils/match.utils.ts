import { MatchConfidence } from '../interfaces/ocr';
import { normalize, tokens } from './text.utils';

export interface MatchCandidate {
	id: number;
	name: string;
}

export interface MatchResult {
	recipe_id: number | null;
	confidence: MatchConfidence;
	candidates: { recipe_id: number; name: string; score: number }[];
}

/** Llave estable para recordar cómo se mapeó un producto del ticket a una receta. */
export const aliasKey = (itemName: string, variantModifiers: string[]): string =>
	[normalize(itemName), ...variantModifiers.map(normalize).sort()].join('|');

/**
 * Puntaje 0..1 entre el texto del ticket (nombre + modificadores que definen variante) y una receta.
 * Pondera qué tanto del nombre de la receta se cubre (60%) y qué tanto del ticket se usa (40%).
 * Exige que al menos una palabra del nombre del producto esté en la receta.
 */
export const score = (itemName: string, variantModifiers: string[], recipeName: string): number => {
	const itemTokens = tokens(itemName);
	const query = new Set([...itemTokens, ...variantModifiers.flatMap(tokens)]);
	const target = tokens(recipeName);
	if (!target.length || !query.size) return 0;
	if (!itemTokens.some((t) => target.includes(t))) return 0;
	const matched = target.filter((t) => query.has(t)).length;
	return (matched / target.length) * 0.6 + (matched / query.size) * 0.4;
};

export const bestMatch = (
	itemName: string,
	variantModifiers: string[],
	candidates: MatchCandidate[],
	aliases: Map<string, number>
): MatchResult => {
	const key = aliasKey(itemName, variantModifiers);
	const ranked = candidates
		.map((c) => ({ recipe_id: c.id, name: c.name, score: score(itemName, variantModifiers, c.name) }))
		.filter((c) => c.score > 0)
		.sort((a, b) => b.score - a.score || a.name.length - b.name.length)
		.slice(0, 5)
		.map((c) => ({ ...c, score: Math.round(c.score * 100) / 100 }));

	const aliased = aliases.get(key);
	if (aliased && candidates.some((c) => c.id === aliased)) {
		return { recipe_id: aliased, confidence: 'alta', candidates: ranked };
	}
	const [top, second] = ranked;
	if (!top || top.score < 0.5) return { recipe_id: null, confidence: 'ninguna', candidates: ranked };
	const tie = second && second.score === top.score;
	const confidence: MatchConfidence = top.score >= 0.8 && !tie ? 'alta' : tie ? 'baja' : 'media';
	return { recipe_id: top.recipe_id, confidence, candidates: ranked };
};

export default { aliasKey, score, bestMatch };
