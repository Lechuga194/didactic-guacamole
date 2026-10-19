import http from 'http';
import { Server as IOServer } from 'socket.io';
import corsUtils from '../utils/cors.utils';
import { SocketEvent } from '../interfaces/socket';

let io: IOServer | null = null;

/** Inicializa Socket.io sobre el servidor HTTP. Los clientes sólo escuchan; no hay eventos entrantes. */
export const init = (server: http.Server): void => {
	io = new IOServer(server, { cors: { origin: corsUtils.allowedOrigins() } });
	io.on('connection', (client) => {
		client.emit('hello', { at: new Date().toISOString() });
	});
};

/** Notifica a todas las pantallas abiertas que algo cambió en la BD. */
export const emit = (event: SocketEvent, payload: Record<string, unknown> = {}): void => {
	io?.emit(event, { ...payload, at: new Date().toISOString() });
};

export default { init, emit };
