/** Orígenes permitidos para HTTP y sockets (CORS_ORIGINS separado por comas). */
export const allowedOrigins = (): string[] =>
	(process.env.CORS_ORIGINS || 'http://localhost:4200')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean);

export default { allowedOrigins };
