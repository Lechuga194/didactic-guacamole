import path from 'path';

export const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const DB_FILE = path.resolve(ROOT_DIR, process.env.DB_FILE || 'data/cocina.sqlite');
export const BACKUP_DIR = path.resolve(ROOT_DIR, process.env.BACKUP_DIR || 'data/backups');
export const DDL_DIR = path.resolve(ROOT_DIR, 'database', 'ddl');
export const TESSDATA_DIR = path.resolve(ROOT_DIR, process.env.TESSDATA_DIR || 'tessdata');
/** Build del frontend a servir junto con la API (app de escritorio). Vacío = no se sirve. */
export const STATIC_DIR = process.env.STATIC_DIR ? path.resolve(ROOT_DIR, process.env.STATIC_DIR) : '';

export default { ROOT_DIR, DB_FILE, BACKUP_DIR, DDL_DIR, TESSDATA_DIR, STATIC_DIR };
