import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

/**
 * Conexión en vivo con el backend: cada vez que se registra o modifica algo
 * las pantallas abiertas reciben una señal y vuelven a consultar.
 */
@Injectable({ providedIn: 'root' })
export class LiveService {
  readonly connected = signal(false);
  /** Se incrementa con cada cambio de pedidos */
  readonly ordersVersion = signal(0);
  /** Se incrementa con cada cambio de catálogo o configuración */
  readonly catalogVersion = signal(0);
  private socket: Socket;

  constructor() {
    this.socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] });
    this.socket.on('connect', () => this.connected.set(true));
    this.socket.on('disconnect', () => this.connected.set(false));
    this.socket.on('orders:changed', () => this.ordersVersion.update((v) => v + 1));
    this.socket.on('catalog:changed', () => this.catalogVersion.update((v) => v + 1));
    this.socket.on('settings:changed', () => this.catalogVersion.update((v) => v + 1));
  }
}
