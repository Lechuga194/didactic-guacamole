import fs from 'fs';
import path from 'path';
import knex, { Knex } from 'knex';
import { DB_FILE } from './db.constants';
import migrationService from '../services/migration.service';
import backupService from '../services/backup.service';

interface SqliteConnection {
	pragma: (sql: string) => unknown;
}

export const dbConf = (): Knex.Config => ({
	client: 'better-sqlite3',
	connection: { filename: DB_FILE },
	useNullAsDefault: true,
	pool: {
		min: 1,
		max: 1,
		afterCreate: (conn: SqliteConnection, done: (err: Error | null, conn: SqliteConnection) => void) => {
			conn.pragma('foreign_keys = ON');
			conn.pragma('journal_mode = WAL');
			conn.pragma('busy_timeout = 5000');
			done(null, conn);
		}
	}
});

/** Prueba la conexión, aplica los DDL pendientes y genera un respaldo diario. */
export const dbConnection = async (): Promise<void> => {
	fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
	const db = knex(dbConf());
	try {
		await db.raw('SELECT 1');
		const applied = await migrationService.migrate(db);
		if (applied.length) console.log(`DDL aplicados: ${applied.join(', ')}`);
		const backup = await backupService.ensureDailyBackup(db);
		if (backup) console.log(`Respaldo creado: ${backup}`);
		console.log(`Base de datos lista: ${DB_FILE}`);
	} finally {
		await db.destroy();
	}
};

export default { dbConf, dbConnection };
