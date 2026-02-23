import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import DatabaseManager from './database/db'

let mainWindow: BrowserWindow | null = null
let db: DatabaseManager

// Sécurité : désactiver les modules Node dans le renderer
app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
        event.preventDefault()
        shell.openExternal(navigationUrl)
    })
})

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        },
        show: false,
        frame: true,
        titleBarStyle: 'default'
    })

    // Charger l'application
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(() => {
    // Initialiser la base de données
    db = DatabaseManager.getInstance()
    
    createWindow()

    // IPC Handlers
    ipcMain.handle('auth:login', async (_, username: string, password: string) => {
        return await db.verifyAdmin(username, password)
    })

    ipcMain.handle('clients:get-all', () => {
        return db.getClients()
    })

    ipcMain.handle('clients:create', (_, client) => {
        return db.createClient(client)
    })

    ipcMain.handle('commandes:get-all', () => {
        return db.getCommandes()
    })

    ipcMain.handle('commandes:get-by-statut', (_, statut: string) => {
        return db.getCommandesByStatut(statut)
    })

    ipcMain.handle('commandes:search', (_, search: string) => {
        return db.searchCommandesByClient(search)
    })

    ipcMain.handle('commandes:create', (_, commande) => {
        return db.createCommande(commande)
    })

    ipcMain.handle('commandes:update-statut', (_, id: number, statut: string) => {
        return db.updateCommandeStatut(id, statut)
    })

    ipcMain.handle('commandes:update', (_, id: number, commande) => {
        return db.updateCommande(id, commande)
    })

    ipcMain.handle('commandes:delete', (_, id: number) => {
        return db.deleteCommande(id)
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (db) db.close()
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})