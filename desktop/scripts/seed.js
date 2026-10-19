/**
 * Guarda una copia de backend/data/cocina.sqlite en desktop/seed/cocina.sqlite.
 * Esa copia es la que incluye la app cuando se empaqueta en GitHub Actions (donde no existe backend/data).
 * Uso: npm run seed
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const src = path.join(ROOT, 'backend', 'data', 'cocina.sqlite');
const dest = path.join(ROOT, 'desktop', 'seed', 'cocina.sqlite');
if (!fs.existsSync(src)) throw new Error(`No existe ${src}`);

const Database = require(path.join(ROOT, 'backend', 'node_modules', 'better-sqlite3'));
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.rmSync(dest, { force: true });
const db = new Database(src, { readonly: true });
try {
	db.prepare('VACUUM INTO ?').run(dest);
} finally {
	db.close();
}
console.log(`Copia guardada en ${path.relative(ROOT, dest)} (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
