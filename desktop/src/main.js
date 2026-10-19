/**
 * Proceso principal de la app de escritorio.
 * Arranca el backend de Express dentro de Electron (misma app, sin terminal) y abre una
 * ventana que carga el frontend que sirve ese mismo backend. Los portales de DiDi, Rappi y
 * Uber se muestran en <webview> con una sesión persistente por plataforma.
 */
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, Menu, dialog, ipcMain, session, shell } = require('electron');

const PORT = 47821;
const PORTALS = ['didi', 'rappi', 'uber'];
const PORTAL_PERMISSIONS = ['notifications', 'media', 'clipboard-sanitized-write', 'fullscreen'];

let win = null;
let baseUrl = '';

const dataDir = () => app.getPath('userData');
const dbFile = () => path.join(dataDir(), 'cocina.sqlite');
const pendingImportFile = () => path.join(dataDir(), 'importar.txt');

// COCINA_DATA_DIR permite usar otra carpeta de datos (pruebas)
if (process.env.COCINA_DATA_DIR) app.setPath('userData', path.resolve(process.env.COCINA_DATA_DIR));
if (!app.requestSingleInstanceLock()) app.quit();

/** Variables que lee el backend: datos en la carpeta del usuario, frontend empaquetado y sólo acceso local. */
const configureBackend = () => {
	const dir = dataDir();
	process.env.DB_FILE = dbFile();
	process.env.BACKUP_DIR = path.join(dir, 'backups');
	process.env.TESSDATA_DIR = path.join(dir, 'tessdata');
	process.env.STATIC_DIR = path.join(__dirname, 'web');
	process.env.HOST = '127.0.0.1';
	process.env.CORS_ORIGINS = `http://127.0.0.1:${PORT}`;
};

/** Copia una base SQLite (y sus archivos -wal/-shm si existen) sobre la de la app. */
const copyDatabase = (src, dest) => {
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	for (const suffix of ['', '-wal', '-shm']) {
		if (suffix && !fs.existsSync(src + suffix)) fs.rmSync(dest + suffix, { force: true });
		else fs.copyFileSync(src + suffix, dest + suffix);
	}
};

const chooseDatabase = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		title: 'Elige tu base de datos (cocina.sqlite o un respaldo)',
		filters: [{ name: 'Base de datos SQLite', extensions: ['sqlite', 'db'] }],
		properties: ['openFile']
	});
	return canceled ? null : filePaths[0] || null;
};

/**
 * Primera vez: usa la base incluida en la app (copia tomada al empaquetar); si no trae,
 * ofrece traer la de otra computadora en lugar de empezar vacía.
 */
const firstRun = async () => {
	if (fs.existsSync(dbFile())) return;
	const bundled = path.join(__dirname, 'seed', 'cocina.sqlite');
	if (fs.existsSync(bundled)) {
		copyDatabase(bundled, dbFile());
		return;
	}
	const { response } = await dialog.showMessageBox({
		type: 'question',
		buttons: ['Importar mis datos…', 'Empezar con una base nueva'],
		defaultId: 0,
		cancelId: 1,
		title: 'Cocina',
		message: '¿Quieres traer tus datos?',
		detail:
			'Si ya usabas la app en otra computadora, elige el archivo cocina.sqlite (backend/data) o uno de sus respaldos. ' +
			'También puedes hacerlo después desde el menú Archivo.'
	});
	if (response !== 0) return;
	const file = await chooseDatabase();
	if (file) copyDatabase(file, dbFile());
};

/** Aplica una importación pedida desde el menú (se hace antes de abrir la base). */
const applyPendingImport = () => {
	if (!fs.existsSync(pendingImportFile())) return;
	const src = fs.readFileSync(pendingImportFile(), 'utf8').trim();
	fs.rmSync(pendingImportFile(), { force: true });
	if (!src || !fs.existsSync(src)) return;
	if (fs.existsSync(dbFile())) {
		const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
		const backupDir = path.join(dataDir(), 'backups');
		fs.mkdirSync(backupDir, { recursive: true });
		copyDatabase(dbFile(), path.join(backupDir, `cocina-antes-de-importar-${stamp}.sqlite`));
	}
	copyDatabase(src, dbFile());
};

const importFromMenu = async () => {
	const file = await chooseDatabase();
	if (!file) return;
	const { response } = await dialog.showMessageBox(win, {
		type: 'warning',
		buttons: ['Importar y reiniciar', 'Cancelar'],
		defaultId: 0,
		cancelId: 1,
		message: 'Reemplazar los datos actuales',
		detail: `Se usará ${path.basename(file)} en lugar de la base actual. Antes se guarda una copia de la base actual en Respaldos.`
	});
	if (response !== 0) return;
	fs.writeFileSync(pendingImportFile(), file);
	app.relaunch();
	app.exit(0);
};

/** Arranca Express en el puerto fijo (así se conservan tema y preferencias); si está ocupado usa uno libre. */
const startBackend = async () => {
	const Server = require('./backend/dist/models/server').default;
	for (const port of [PORT, 0]) {
		process.env.PORT = String(port);
		try {
			return await new Server().start();
		} catch (error) {
			if (error.code !== 'EADDRINUSE') throw error;
		}
	}
	throw new Error('No hay puerto disponible');
};

/** Quita "Electron/x" del user agent: algunos portales rechazan navegadores que no reconocen. */
const cleanUserAgent = () => {
	const name = app.getName().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const ua = app.userAgentFallback
		.replace(/\sElectron\/\S+/i, '')
		.replace(new RegExp(`\\s${name}\\/\\S+`, 'i'), '')
		.replace(/\scocina-desktop\/\S+/i, '');
	app.userAgentFallback = ua;
	for (const code of PORTALS) session.fromPartition(`persist:${code}`).setUserAgent(ua);
};

const configurePortalSessions = () => {
	for (const code of PORTALS) {
		const s = session.fromPartition(`persist:${code}`);
		s.setPermissionRequestHandler((_wc, permission, done) => done(PORTAL_PERMISSIONS.includes(permission)));
	}
};

const isLocal = (url) => !!baseUrl && url.startsWith(baseUrl);
const isWeb = (url) => /^https?:\/\//i.test(url);

const createWindow = () => {
	win = new BrowserWindow({
		width: 1440,
		height: 900,
		minWidth: 1000,
		minHeight: 640,
		show: false,
		title: 'Cocina',
		backgroundColor: '#f5f5f5',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			sandbox: true,
			nodeIntegration: false,
			webviewTag: true
		}
	});
	win.once('ready-to-show', () => {
		win.maximize();
		win.show();
	});
	win.on('closed', () => (win = null));

	// Los portales sólo pueden cargarse en webviews sin Node ni preload, y siguen activos aunque no se vean
	win.webContents.on('will-attach-webview', (event, prefs, params) => {
		delete prefs.preload;
		prefs.nodeIntegration = false;
		prefs.contextIsolation = true;
		prefs.backgroundThrottling = false;
		if (!isWeb(params.src) || !PORTALS.some((c) => params.partition === `persist:${c}`)) event.preventDefault();
	});
	// Enlaces externos de la app (p. ej. "abrir en el navegador") van al navegador del sistema
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (isWeb(url) && !isLocal(url)) shell.openExternal(url);
		return { action: 'deny' };
	});
	win.webContents.on('will-navigate', (event, url) => {
		if (isLocal(url)) return;
		event.preventDefault();
		if (isWeb(url)) shell.openExternal(url);
	});
	win.loadURL(baseUrl);
};

/** Ventanas emergentes dentro de un portal (inicio de sesión, impresión de tickets) se abren con su misma sesión. */
app.on('web-contents-created', (_event, contents) => {
	if (contents.getType() !== 'webview') return;
	contents.setWindowOpenHandler(({ url }) => {
		if (!isWeb(url)) return { action: 'deny' };
		return {
			action: 'allow',
			overrideBrowserWindowOptions: { width: 1000, height: 800, autoHideMenuBar: true }
		};
	});
});

const buildMenu = () => {
	const mac = process.platform === 'darwin';
	const template = [
		...(mac ? [{ role: 'appMenu' }] : []),
		{
			label: 'Archivo',
			submenu: [
				{ label: 'Importar base de datos…', click: importFromMenu },
				{ label: 'Abrir carpeta de datos', click: () => shell.openPath(dataDir()) },
				{ label: 'Abrir carpeta de respaldos', click: () => shell.openPath(path.join(dataDir(), 'backups')) },
				{ type: 'separator' },
				mac ? { role: 'close', label: 'Cerrar ventana' } : { role: 'quit', label: 'Salir' }
			]
		},
		{ role: 'editMenu', label: 'Edición' },
		{
			label: 'Ver',
			submenu: [
				{ role: 'reload', label: 'Recargar' },
				{ role: 'toggleDevTools', label: 'Herramientas de desarrollo' },
				{ type: 'separator' },
				{ role: 'resetZoom', label: 'Tamaño real' },
				{ role: 'zoomIn', label: 'Acercar' },
				{ role: 'zoomOut', label: 'Alejar' },
				{ type: 'separator' },
				{ role: 'togglefullscreen', label: 'Pantalla completa' }
			]
		},
		{ role: 'windowMenu', label: 'Ventana' }
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

ipcMain.on('badge', (_event, count) => app.setBadgeCount(Math.max(0, Number(count) || 0)));
ipcMain.on('open-external', (_event, url) => {
	if (typeof url === 'string' && isWeb(url)) shell.openExternal(url);
});

app.on('second-instance', () => {
	if (!win) return;
	if (win.isMinimized()) win.restore();
	win.focus();
});

app.whenReady().then(async () => {
	try {
		configureBackend();
		applyPendingImport();
		await firstRun();
		const port = await startBackend();
		baseUrl = `http://127.0.0.1:${port}/`;
		cleanUserAgent();
		configurePortalSessions();
		buildMenu();
		createWindow();
	} catch (error) {
		dialog.showErrorBox('No se pudo iniciar Cocina', String(error?.stack || error));
		app.exit(1);
	}
});

// En Mac la app sigue viva al cerrar la ventana (como cualquier app); el Dock la vuelve a abrir
app.on('activate', () => {
	if (!win && baseUrl) createWindow();
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
