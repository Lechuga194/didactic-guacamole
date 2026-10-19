const STOPWORDS = new Set([
	'de',
	'del',
	'con',
	'y',
	'la',
	'el',
	'los',
	'las',
	'en',
	'al',
	'a',
	'para',
	'orden',
	'combo'
]);

/** minúsculas, sin acentos y con espacios simples */
export const normalize = (text: string): string =>
	(text || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9%$.,\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

/** Raíz muy simple para empatar singular/plural y género (verdes/verde, rojos/roja). */
export const stem = (word: string): string => {
	let w = word;
	if (w.length > 4 && w.endsWith('es')) w = w.slice(0, -2);
	else if (w.length > 3 && w.endsWith('s')) w = w.slice(0, -1);
	if (w.length > 3 && /[aeo]$/.test(w)) w = w.slice(0, -1);
	return w;
};

/** Palabras significativas de un texto (sin stopwords, sin gramajes tipo "130g"). */
export const tokens = (text: string): string[] => {
	const clean = normalize((text || '').replace(/\([^)]*\)/g, ' ')).replace(/[.,$%]/g, ' ');
	const out: string[] = [];
	for (const w of clean.split(' ')) {
		if (!w || STOPWORDS.has(w)) continue;
		if (/^\d+(g|gr|ml|pz|pzas?)$/.test(w)) continue;
		out.push(/\d/.test(w) ? w : stem(w));
	}
	return [...new Set(out)];
};

export default { normalize, stem, tokens };
