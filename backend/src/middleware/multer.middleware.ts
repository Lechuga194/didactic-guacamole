import multer from 'multer';

const ALLOWED = ['image/png', 'image/jpeg'];

/** Imágenes de tickets en memoria (no se guardan en disco), máximo 15 MB. */
export const ticketUpload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 15 * 1024 * 1024, files: 1 },
	fileFilter: (_req, file, cb) => {
		if (ALLOWED.includes(file.mimetype)) cb(null, true);
		else cb(new Error('Sólo se aceptan imágenes PNG o JPG'));
	}
});

export default { ticketUpload };
