"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./database/db"));
let mainWindow = null;
let db;
// Sécurité : désactiver les modules Node dans le renderer
electron_1.app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault();
        electron_1.shell.openExternal(navigationUrl);
    });
});
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        },
        show: false,
        frame: true,
        titleBarStyle: 'default'
    });
    // Charger l'application
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../renderer/index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.whenReady().then(() => {
    // Initialiser la base de données
    db = db_1.default.getInstance();
    createWindow();
    // IPC Handlers
    electron_1.ipcMain.handle('auth:login', async (_, username, password) => {
        return await db.verifyAdmin(username, password);
    });
    electron_1.ipcMain.handle('clients:get-all', () => {
        return db.getClients();
    });
    electron_1.ipcMain.handle('clients:create', (_, client) => {
        return db.createClient(client);
    });
    electron_1.ipcMain.handle('commandes:get-all', () => {
        return db.getCommandes();
    });
    electron_1.ipcMain.handle('commandes:get-by-statut', (_, statut) => {
        return db.getCommandesByStatut(statut);
    });
    electron_1.ipcMain.handle('commandes:search', (_, search) => {
        return db.searchCommandesByClient(search);
    });
    electron_1.ipcMain.handle('commandes:create', (_, commande) => {
        return db.createCommande(commande);
    });
    electron_1.ipcMain.handle('commandes:update-statut', (_, id, statut) => {
        return db.updateCommandeStatut(id, statut);
    });
    electron_1.ipcMain.handle('commandes:update', (_, id, commande) => {
        return db.updateCommande(id, commande);
    });
    electron_1.ipcMain.handle('commandes:delete', (_, id) => {
        return db.deleteCommande(id);
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (db)
            db.close();
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
