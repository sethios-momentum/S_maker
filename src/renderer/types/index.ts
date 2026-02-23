export interface Client {
    id: number
    nom: string
    email?: string
    telephone?: string
    created_at?: string
}

export interface Commande {
    id: number
    client_id: number
    client_nom?: string
    produit: string
    quantite: number
    prix_unitaire: number
    statut: 'EN_COURS' | 'PRET' | 'LIVRE'
    date_commande: string
    notes?: string
}

export type CommandeStatut = 'EN_COURS' | 'PRET' | 'LIVRE'

export interface CommandeFormData {
    client_id: number
    produit: string
    quantite: number
    prix_unitaire: number
    statut: CommandeStatut
    notes: string
}