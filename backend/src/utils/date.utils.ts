const pad = (n: number): string => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' en hora local */
export const toDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 'YYYY-MM-DD HH:MM' en hora local */
export const toStamp = (d: Date): string => `${toDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const today = (): string => toDate(new Date());

export const addDays = (date: string, days: number): string => {
	const [y, m, d] = date.split('-').map(Number);
	return toDate(new Date(y, m - 1, d + days));
};

/** Días entre dos fechas 'YYYY-MM-DD' (inclusivo) */
export const daysBetween = (from: string, to: string): number => {
	const [y1, m1, d1] = from.split('-').map(Number);
	const [y2, m2, d2] = to.split('-').map(Number);
	return Math.round((new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) / 86400000) + 1;
};

const MONTHS: Record<string, number> = {
	ene: 1,
	jan: 1,
	feb: 2,
	mar: 3,
	abr: 4,
	apr: 4,
	may: 5,
	jun: 6,
	jul: 7,
	ago: 8,
	aug: 8,
	sep: 9,
	set: 9,
	oct: 10,
	nov: 11,
	dic: 12,
	dec: 12
};

const to24 = (hour: number, ampm?: string): number => {
	const suffix = (ampm || '').toLowerCase().replace(/\./g, '');
	if (suffix.startsWith('p') && hour < 12) return hour + 12;
	if (suffix.startsWith('a') && hour === 12) return 0;
	return hour;
};

/**
 * Busca una fecha en texto de ticket y la devuelve como 'YYYY-MM-DD HH:MM'.
 * Formatos: "15 de oct, 10:58 am" (DiDi) y "Oct 05, 2026, 4 PM" (Uber).
 * Si no trae año se usa el actual (o el anterior si quedaría en el futuro).
 */
export const parseReceiptDate = (text: string, now = new Date()): string | null => {
	const t = text.toLowerCase();
	let day: number | undefined;
	let month: number | undefined;
	let year: number | undefined;
	let hour = 12;
	let minute = 0;

	const es = t.match(
		/(\d{1,2})\s+de\s+([a-z]{3})[a-z]*\.?,?\s*(\d{4})?,?\s*(\d{1,2})(?::(\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?/
	);
	const en = t.match(/([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s*(\d{4})?,?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
	if (es && MONTHS[es[2]]) {
		day = Number(es[1]);
		month = MONTHS[es[2]];
		year = es[3] ? Number(es[3]) : undefined;
		hour = to24(Number(es[4]), es[6]);
		minute = es[5] ? Number(es[5]) : 0;
	} else if (en && MONTHS[en[1]]) {
		month = MONTHS[en[1]];
		day = Number(en[2]);
		year = en[3] ? Number(en[3]) : undefined;
		hour = to24(Number(en[4]), en[6]);
		minute = en[5] ? Number(en[5]) : 0;
	}
	if (!day || !month || day > 31 || hour > 23 || minute > 59) return null;
	if (!year) {
		year = now.getFullYear();
		if (new Date(year, month - 1, day) > now) year -= 1;
	}
	return toStamp(new Date(year, month - 1, day, hour, minute));
};

export default { toDate, toStamp, today, addDays, daysBetween, parseReceiptDate };
