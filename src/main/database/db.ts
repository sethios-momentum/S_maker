import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import bcrypt from 'bcrypt'

export interface Client {
    id?: number
    nom: string
    email?: string
    telephone?: string
}

export interface Commande {
    id?: number
    client_id: number
    client_nom?: string
    produit: string
    quantite: number
    prix_unitaire: number
    statut: 'EN_COURS' | 'PRET' | 'LIVRE'
    date_commande?: string
    notes?: string
}

export interface Admin {
    id?: number
    username: string
    password_hash: string
}

class DatabaseManager {
    private db: Database.Database
    private static instance: DatabaseManager

    private constructor() {
        const userDataPath = app.getPath('userData')
        const dbPath = path.join(userDataPath, 's-market.db')
        
        // Vérifier si la base de données existe
        const dbExists = fs.existsSync(dbPath)
        
        this.db = new Database(dbPath)
        
        if (!dbExists) {
            this.initializeDatabase()
            this.createDefaultAdmin()
        }
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager()
        }
        return DatabaseManager.instance
    }

    private initializeDatabase() {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
        this.db.exec(schema)
    }

    private async createDefaultAdmin() {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash('admin123', salt)
        
        const stmt = this.db.prepare('INSERT OR IGNORE INTO admin (username, password_hash) VALUES (?, ?)')
        stmt.run('admin', hash)
    }

    // Admin methods
    public async verifyAdmin(username: string, password: string): Promise<boolean> {
        const stmt = this.db.prepare('SELECT password_hash FROM admin WHERE username = ?')
        const admin = stmt.get(username) as Admin | undefined
        
        if (!admin) return false
        
        return await bcrypt.compare(password, admin.password_hash)
    }

    // Clients methods
    public getClients(): Client[] {
        const stmt = this.db.prepare('SELECT * FROM clients ORDER BY nom')
        return stmt.all() as Client[]
    }

    public getClientById(id: number): Client | undefined {
        const stmt = this.db.prepare('SELECT * FROM clients WHERE id = ?')
        return stmt.get(id) as Client | undefined
    }

    public createClient(client: Omit<Client, 'id'>): number {
        const stmt = this.db.prepare(
            'INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)'
        )
        const result = stmt.run(client.nom, client.email, client.telephone)
        return result.lastInsertRowid as number
    }

    // Commandes methods
    public getCommandes(): Commande[] {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            ORDER BY c.date_commande DESC
        `)
        return stmt.all() as Commande[]
    }

    public getCommandesByStatut(statut: string): Commande[] {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.statut = ?
            ORDER BY c.date_commande DESC
        `)
        return stmt.all(statut) as Commande[]
    }

    public searchCommandesByClient(search: string): Commande[] {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            WHERE cl.nom LIKE ?
            ORDER BY c.date_commande DESC
        `)
        return stmt.all(`%${search}%`) as Commande[]
    }

    public createCommande(commande: Omit<Commande, 'id' | 'date_commande'>): number {
        const stmt = this.db.prepare(
            'INSERT INTO commandes (client_id, produit, quantite, prix_unitaire, statut, notes) VALUES (?, ?, ?, ?, ?, ?)'
        )
        const result = stmt.run(
            commande.client_id,
            commande.produit,
            commande.quantite,
            commande.prix_unitaire,
            commande.statut,
            commande.notes
        )
        return result.lastInsertRowid as number
    }

    public updateCommandeStatut(id: number, statut: string): boolean {
        const stmt = this.db.prepare('UPDATE commandes SET statut = ? WHERE id = ?')
        const result = stmt.run(statut, id)
        return result.changes > 0
    }

    public updateCommande(id: number, commande: Partial<Commande>): boolean {
        const fields = []
        const values = []
        
        if (commande.client_id !== undefined) {
            fields.push('client_id = ?')
            values.push(commande.client_id)
        }
        if (commande.produit !== undefined) {
            fields.push('produit = ?')
            values.push(commande.produit)
        }
        if (commande.quantite !== undefined) {
            fields.push('quantite = ?')
            values.push(commande.quantite)
        }
        if (commande.prix_unitaire !== undefined) {
            fields.push('prix_unitaire = ?')
            values.push(commande.prix_unitaire)
        }
        if (commande.statut !== undefined) {
            fields.push('statut = ?')
            values.push(commande.statut)
        }
        if (commande.notes !== undefined) {
            fields.push('notes = ?')
            values.push(commande.notes)
        }

        if (fields.length === 0) return false

        values.push(id)
        const stmt = this.db.prepare(`UPDATE commandes SET ${fields.join(', ')} WHERE id = ?`)
        const result = stmt.run(...values)
        return result.changes > 0
    }

    public deleteCommande(id: number): boolean {
        const stmt = this.db.prepare('DELETE FROM commandes WHERE id = ?')
        const result = stmt.run(id)
        return result.changes > 0
    }

    public close() {
        this.db.close()
    }
}

export default DatabaseManager