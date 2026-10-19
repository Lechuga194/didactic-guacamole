/** Puente mínimo entre la app (Angular) y Electron. La app lo detecta en window.cocinaDesktop. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('cocinaDesktop', {
	platform: process.platform,
	setBadge: (count) => ipcRenderer.send('badge', count),
	openExternal: (url) => ipcRenderer.send('open-external', url)
});
