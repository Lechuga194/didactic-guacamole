import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { throwGenericError } from '../utils/error.utils';

type Source = 'body' | 'query';

/** Crea un middleware que valida req.body (o req.query) contra un esquema Joi estricto. */
export const guard =
	(schema: Joi.ObjectSchema, source: Source = 'body') =>
	(req: Request, res: Response, next: NextFunction): void => {
		const { error, value } = schema
			.unknown(false)
			.validate(req[source] ?? {}, { abortEarly: false, convert: true });
		if (error) {
			throwGenericError(
				res,
				'Datos inválidos',
				error.details.map((d) => d.message)
			);
			return;
		}
		if (source === 'body') req.body = value;
		else Object.defineProperty(req, 'query', { value, writable: true });
		next();
	};

export const dateStr = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/);
export const stampStr = Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
export const pct = Joi.number().min(0).max(0.99);

export const verifyRange = guard(Joi.object({ from: dateStr.required(), to: dateStr.required() }), 'query');
export const verifyDate = guard(Joi.object({ date: dateStr }), 'query');

export default { guard, verifyRange, verifyDate };
