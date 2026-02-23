import { contextBridge, ipcRenderer } from 'electron'
import { Client, Commande } from './database/db'

// Types exposés au renderer
export interface IElectronAPI {
    // Auth
    login: (username: string, password: string) => Promise<boolean>
    
    // Clients
    getClients: () => Promise<Client[]>
    createClient: (client: Omit<Client, 'id'>) => Promise<number>
    
    // Commandes
    getCommandes: () => Promise<Commande[]>
    getCommandesByStatut: (statut: string) => Promise<Commande[]>
    searchCommandes: (search: string) => Promise<Commande[]>
    createCommande: (commande: Omit<Commande, 'id' | 'date_commande'>) => Promise<number>
    updateCommandeStatut: (id: number, statut: string) => Promise<boolean>
    updateCommande: (id: number, commande: Partial<Commande>) => Promise<boolean>
    deleteCommande: (id: number) => Promise<boolean>
}

contextBridge.exposeInMainWorld('electronAPI', {
    // Auth
    login: (username: string, password: string) => 
        ipcRenderer.invoke('auth:login', username, password),
    
    // Clients
    getClients: () => ipcRenderer.invoke('clients:get-all'),
    createClient: (client: Omit<Client, 'id'>) => 
        ipcRenderer.invoke('clients:create', client),
    
    // Commandes
    getCommandes: () => ipcRenderer.invoke('commandes:get-all'),
    getCommandesByStatut: (statut: string) => 
        ipcRenderer.invoke('commandes:get-by-statut', statut),
    searchCommandes: (search: string) => 
        ipcRenderer.invoke('commandes:search', search),
    createCommande: (commande: Omit<Commande, 'id' | 'date_commande'>) => 
        ipcRenderer.invoke('commandes:create', commande),
    updateCommandeStatut: (id: number, statut: string) => 
        ipcRenderer.invoke('commandes:update-statut', id, statut),
    updateCommande: (id: number, commande: Partial<Commande>) => 
        ipcRenderer.invoke('commandes:update', id, commande),
    deleteCommande: (id: number) => 
        ipcRenderer.invoke('commandes:delete', id)
})