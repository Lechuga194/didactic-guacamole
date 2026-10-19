import http from 'http';
import express, { Application } from 'express';
import cors from 'cors';
import { dbConnection } from '../config/db.config';
import routes from '../routes';
import socket from './socket';
import corsUtils from '../utils/cors.utils';

class Server {
	private app: Application;
	private port: string;
	private ready: Promise<void>;

	constructor() {
		this.port = process.env.PORT || '3000';
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
	}

	async listen(): Promise<void> {
		try {
			await this.ready;
		} catch (error) {
			console.error('No se pudo preparar la base de datos', error);
			process.exit(1);
		}
		const server = http.createServer(this.app);
		server.listen(this.port, () => console.log(`API escuchando en http://localhost:${this.port}/api`));
		socket.init(server);
	}
}

export default Server;
