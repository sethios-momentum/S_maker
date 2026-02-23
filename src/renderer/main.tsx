import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/App.css'

// Déclaration des types pour l'API Electron
declare global {
    interface Window {
        electronAPI: {
            login: (username: string, password: string) => Promise<boolean>
            getClients: () => Promise<any[]>
            getCommandes: () => Promise<any[]>
            getCommandesByStatut: (statut: string) => Promise<any[]>
            searchCommandes: (search: string) => Promise<any[]>
            createCommande: (commande: any) => Promise<number>
            updateCommandeStatut: (id: number, statut: string) => Promise<boolean>
            updateCommande: (id: number, commande: any) => Promise<boolean>
            deleteCommande: (id: number) => Promise<boolean>
        }
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)