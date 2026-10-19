import fs from 'fs';
import path from 'path';
import { createWorker, Worker } from 'tesseract.js';
import { TESSDATA_DIR } from '../config/db.constants';
import { OcrLine, OcrPage } from '../interfaces/ocr';
import imageUtils from '../utils/image.utils';

const LANGS = ['spa', 'eng'];
let workerPromise: Promise<Worker> | null = null;

/** Copia los modelos de idioma que vienen en npm (@tesseract.js-data/*) a una carpeta local; así funciona sin internet. */
const ensureTessdata = (): void => {
	fs.mkdirSync(TESSDATA_DIR, { recursive: true });
	for (const lang of LANGS) {
		const target = path.join(TESSDATA_DIR, `${lang}.traineddata.gz`);
		if (fs.existsSync(target)) continue;
		const pkgDir = path.dirname(require.resolve(`@tesseract.js-data/${lang}/package.json`));
		fs.copyFileSync(path.join(pkgDir, '4.0.0_best_int', `${lang}.traineddata.gz`), target);
	}
};

const getWorker = (): Promise<Worker> => {
	if (!workerPromise) {
		ensureTessdata();
		workerPromise = createWorker(LANGS, 1, { langPath: TESSDATA_DIR, gzip: true, cacheMethod: 'none' }).catch(
			(error) => {
				workerPromise = null;
				throw error;
			}
		);
	}
	return workerPromise;
};

/** Reconoce el texto de una imagen y devuelve líneas con su posición. */
export const recognize = async (image: Buffer): Promise<OcrPage> => {
	const size = imageUtils.imageSize(image);
	if (!size) throw new Error('Formato de imagen no soportado (usa PNG o JPG)');
	const worker = await getWorker();
	const { data } = await worker.recognize(image, {}, { blocks: true, text: true });
	const lines: OcrLine[] = [];
	for (const block of data.blocks || []) {
		for (const paragraph of block.paragraphs) {
			for (const line of paragraph.lines) {
				const text = line.text.trim();
				if (!text) continue;
				lines.push({
					text,
					x0: line.bbox.x0,
					y0: line.bbox.y0,
					words: line.words.map((w) => ({ text: w.text, x0: w.bbox.x0, x1: w.bbox.x1 }))
				});
			}
		}
	}
	return { width: size.width, height: size.height, lines, text: data.text || '' };
};

export const shutdown = async (): Promise<void> => {
	if (workerPromise) await (await workerPromise).terminate();
	workerPromise = null;
};

export default { recognize, shutdown };
