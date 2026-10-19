import http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import express, { Application } from 'express';
import cors from 'cors';
import { dbConnection } from '../config/db.config';
import { STATIC_DIR } from '../config/db.constants';
import routes from '../routes';
import socket from './socket';
import corsUtils from '../utils/cors.utils';

class Server {
	private app: Application;
	private port: string;
	private host: string | undefined;
	private ready: Promise<void>;

	constructor() {
		this.port = process.env.PORT || '3000';
		this.host = process.env.HOST || undefined;
		this.ready = dbConnection();
		this.app = express();
		this.middlewares();
		this.routes();
	}

	middlewares(): void {
		this.app.use(cors({ origin: corsUtils.allowedOrigins() }));
		this.app.use(express.json({ limit: '5mb' }));
		this.app.use(express.urlencoded({ extended: true }));
	}

	routes(): void {
		this.app.use('/api', routes);
		if (STATIC_DIR) {
			// App de escritorio: el mismo servidor entrega el frontend; las rutas de Angular caen en index.html
			this.app.use(express.static(STATIC_DIR));
			this.app.get('/{*path}', (_req, res) => res.sendFile(path.join(STATIC_DIR, 'index.html')));
		}
	}

	/** Prepara la BD y empieza a escuchar. Devuelve el puerto real (PORT=0 elige uno libre). */
	async start(): Promise<number> {
		await this.ready;
		const server = http.createServer(this.app);
		await new Promise<void>((resolve, reject) => {
			server.once('error', reject);
			server.listen(Number(this.port), this.host, () => resolve());
		});
		socket.init(server);
		return (server.address() as AddressInfo).port;
	}

	async listen(): Promise<void> {
		try {
			const port = await this.start();
			console.log(`API escuchando en http://localhost:${port}/api`);
		} catch (error) {
			console.error('No se pudo iniciar el servidor', error);
			process.exit(1);
		}
	}
}

export default Server;
