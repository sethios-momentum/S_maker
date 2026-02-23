"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Auth
    login: (username, password) => electron_1.ipcRenderer.invoke('auth:login', username, password),
    // Clients
    getClients: () => electron_1.ipcRenderer.invoke('clients:get-all'),
    createClient: (client) => electron_1.ipcRenderer.invoke('clients:create', client),
    // Commandes
    getCommandes: () => electron_1.ipcRenderer.invoke('commandes:get-all'),
    getCommandesByStatut: (statut) => electron_1.ipcRenderer.invoke('commandes:get-by-statut', statut),
    searchCommandes: (search) => electron_1.ipcRenderer.invoke('commandes:search', search),
    createCommande: (commande) => electron_1.ipcRenderer.invoke('commandes:create', commande),
    updateCommandeStatut: (id, statut) => electron_1.ipcRenderer.invoke('commandes:update-statut', id, statut),
    updateCommande: (id, commande) => electron_1.ipcRenderer.invoke('commandes:update', id, commande),
    deleteCommande: (id) => electron_1.ipcRenderer.invoke('commandes:delete', id)
});
