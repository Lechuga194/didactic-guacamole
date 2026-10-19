import path from 'path';

export const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const DB_FILE = path.resolve(ROOT_DIR, process.env.DB_FILE || 'data/cocina.sqlite');
export const BACKUP_DIR = path.resolve(ROOT_DIR, process.env.BACKUP_DIR || 'data/backups');
export const DDL_DIR = path.resolve(ROOT_DIR, 'database', 'ddl');
export const TESSDATA_DIR = path.resolve(ROOT_DIR, 'tessdata');

export default { ROOT_DIR, DB_FILE, BACKUP_DIR, DDL_DIR, TESSDATA_DIR };
