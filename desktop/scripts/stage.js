/**
 * Arma desktop/build/app: lo que se empaqueta en la app de escritorio.
 *   main.js, preload.js        proceso principal de Electron
 *   backend/dist, backend/database/ddl
 *   web/                        build de Angular (lo sirve el mismo Express)
 *   seed/cocina.sqlite          copia de la base con la que arranca la app la primera vez
 *   node_modules                dependencias de producción del backend
 * Uso: node scripts/stage.js [--skip-build] [--no-db]
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DESKTOP = path.resolve(__dirname, '..');
const ROOT = path.resolve(DESKTOP, '..');
const BACKEND = path.join(ROOT, 'backend');
const FRONTEND = path.join(ROOT, 'frontend');
const APP = path.join(DESKTOP, 'build', 'app');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const run = (cmd, cwd) => {
	console.log(`\n> ${cmd}  (${path.relative(ROOT, cwd) || '.'})`);
	execSync(cmd, { cwd, stdio: 'inherit', shell: true });
};

const copy = (from, to) => fs.cpSync(from, to, { recursive: true, filter: (src) => !src.endsWith('.map') });

if (!process.argv.includes('--skip-build')) {
	run(`${npm} run build`, BACKEND);
	run(`${npm} run build`, FRONTEND);
}

const web = path.join(FRONTEND, 'dist', 'frontend', 'browser');
if (!fs.existsSync(path.join(web, 'index.html'))) throw new Error(`No existe el build del frontend en ${web}`);

// Conserva node_modules entre corridas para no reinstalar todo cada vez
for (const entry of fs.existsSync(APP) ? fs.readdirSync(APP) : []) {
	if (entry !== 'node_modules') fs.rmSync(path.join(APP, entry), { recursive: true, force: true });
}
fs.mkdirSync(APP, { recursive: true });

copy(path.join(DESKTOP, 'src'), APP);
copy(path.join(BACKEND, 'dist'), path.join(APP, 'backend', 'dist'));
copy(path.join(BACKEND, 'database', 'ddl'), path.join(APP, 'backend', 'database', 'ddl'));
copy(web, path.join(APP, 'web'));

/**
 * Base de datos incluida en la app: la primera vez que se abre (sin base propia) arranca con ella.
 * Se toma la base local de backend/data; si no existe (p. ej. en GitHub Actions), desktop/seed/cocina.sqlite.
 * VACUUM INTO hace una copia consistente aunque el backend esté corriendo.
 */
const snapshotDb = (src, dest) => {
	const Database = require(path.join(BACKEND, 'node_modules', 'better-sqlite3'));
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.rmSync(dest, { force: true });
	const db = new Database(src, { readonly: true });
	try {
		db.prepare('VACUUM INTO ?').run(dest);
	} finally {
		db.close();
	}
};
const seedSources = [path.join(BACKEND, 'data', 'cocina.sqlite'), path.join(DESKTOP, 'seed', 'cocina.sqlite')];
const seed = process.argv.includes('--no-db') ? null : seedSources.find((f) => fs.existsSync(f));
if (seed) {
	snapshotDb(seed, path.join(APP, 'seed', 'cocina.sqlite'));
	console.log(`\nBase incluida: ${path.relative(ROOT, seed)}`);
} else {
	console.log('\nSin base incluida: la app pedirá importar una o empezará vacía');
}

const backendPkg = require(path.join(BACKEND, 'package.json'));
const desktopPkg = require(path.join(DESKTOP, 'package.json'));
const pkg = {
	name: desktopPkg.name,
	productName: 'Cocina',
	version: desktopPkg.version,
	description: desktopPkg.description,
	author: 'Cocina',
	main: 'main.js',
	dependencies: backendPkg.dependencies,
	allowScripts: backendPkg.allowScripts
};
fs.writeFileSync(path.join(APP, 'package.json'), JSON.stringify(pkg, null, '\t') + '\n');
fs.copyFileSync(path.join(BACKEND, 'package-lock.json'), path.join(APP, 'package-lock.json'));

run(`${npm} install --omit=dev --no-audit --no-fund`, APP);
console.log(`\nListo: ${APP}`);
