import { Response } from 'express';

/** Respuesta estándar para errores de validación. */
export const throwGenericError = (res: Response, message: string, details?: unknown, status = 403): Response =>
	res.status(status).json({ error: message, details });

/** Respuesta estándar para errores inesperados en controllers. */
export const serverError = (res: Response, error: unknown): Response => {
	const err = error as Error;
	console.error(err);
	return res.status(500).json({ error: 'Error interno', details: err?.message || String(error) });
};

/** Convierte un parámetro de ruta en id numérico o null. */
export const toId = (value: unknown): number | null => {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : null;
};

export default { throwGenericError, serverError, toId };
