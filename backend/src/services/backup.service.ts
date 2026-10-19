import fs from 'fs';
import path from 'path';
import { Knex } from 'knex';
import { BACKUP_DIR } from '../config/db.constants';
import { BackupInfo } from '../interfaces/backup';

const PREFIX = 'cocina-';

/** Respaldos existentes, del más reciente al más antiguo. */
export const listBackups = (): BackupInfo[] => {
	if (!fs.existsSync(BACKUP_DIR)) return [];
	return fs
		.readdirSync(BACKUP_DIR)
		.filter((f) => f.startsWith(PREFIX) && f.endsWith('.sqlite'))
		.map((f) => {
			const stat = fs.statSync(path.join(BACKUP_DIR, f));
			return { file: f, path: path.join(BACKUP_DIR, f), size: stat.size, created_at: stat.mtime.toISOString() };
		})
		.sort((a, b) => b.created_at.localeCompare(a.created_at));
};

/** Crea una copia consistente de la BD con VACUUM INTO y depura las más viejas. */
export const createBackup = async (db: Knex, keep = 30): Promise<string> => {
	fs.mkdirSync(BACKUP_DIR, { recursive: true });
	const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
	const target = path.join(BACKUP_DIR, `${PREFIX}${stamp}.sqlite`);
	await db.raw('VACUUM INTO ?', [target]);
	for (const old of listBackups().slice(keep)) fs.unlinkSync(old.path);
	return target;
};

/** Crea un respaldo si el último tiene más de 20 horas (se llama al arrancar). */
export const ensureDailyBackup = async (db: Knex): Promise<string | null> => {
	const hasData = await db.schema.hasTable('orders');
	if (!hasData) return null;
	const last = listBackups()[0];
	if (last && Date.now() - new Date(last.created_at).getTime() < 20 * 3600 * 1000) return null;
	const row = await db('settings').where({ key: 'backup_keep' }).first();
	return createBackup(db, Number(row?.value) || 30);
};

export default { listBackups, createBackup, ensureDailyBackup };
