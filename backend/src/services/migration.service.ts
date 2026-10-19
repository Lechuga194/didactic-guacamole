import fs from 'fs';
import path from 'path';
import { Knex } from 'knex';
import { DDL_DIR } from '../config/db.constants';

interface RawSqlite {
	exec: (sql: string) => void;
}

/** Lista los archivos DDL numerados (001_xxx.sql, 002_xxx.sql...) en orden. */
export const listDdlFiles = (): string[] =>
	fs
		.readdirSync(DDL_DIR)
		.filter((f) => /^\d{3}_.+\.sql$/.test(f))
		.sort();

/**
 * Aplica, en una transacción por archivo, los DDL que aún no están registrados
 * en schema_migrations. Devuelve los nombres aplicados.
 */
export const migrate = async (db: Knex): Promise<string[]> => {
	await db.raw(`CREATE TABLE IF NOT EXISTS schema_migrations (
		version    TEXT PRIMARY KEY,
		applied_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
	)`);
	const done = new Set((await db('schema_migrations').select('version')).map((r) => r.version as string));
	const pending = listDdlFiles().filter((f) => !done.has(f));
	if (!pending.length) return [];

	const conn = (await db.client.acquireConnection()) as RawSqlite;
	try {
		for (const file of pending) {
			const sql = fs.readFileSync(path.join(DDL_DIR, file), 'utf8');
			conn.exec('BEGIN');
			try {
				conn.exec(sql);
				conn.exec(`INSERT INTO schema_migrations (version) VALUES ('${file.replace(/'/g, "''")}')`);
				conn.exec('COMMIT');
			} catch (error) {
				conn.exec('ROLLBACK');
				throw new Error(`Error al aplicar ${file}: ${(error as Error).message}`, { cause: error });
			}
		}
	} finally {
		await db.client.releaseConnection(conn);
	}
	return pending;
};

export default { listDdlFiles, migrate };
