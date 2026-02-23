"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class DatabaseManager {
    constructor() {
        const userDataPath = electron_1.app.getPath('userData');
        const dbPath = path_1.default.join(userDataPath, 's-market.db');
        // Vérifier si la base de données existe
        const dbExists = fs_1.default.existsSync(dbPath);
        this.db = new better_sqlite3_1.default(dbPath);
        if (!dbExists) {
            this.initializeDatabase();
            this.createDefaultAdmin();
        }
    }
    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }
    initializeDatabase() {
        const schema = fs_1.default.readFileSync(path_1.default.join(__dirname, 'schema.sql'), 'utf-8');
        this.db.exec(schema);
    }
    async createDefaultAdmin() {
        const salt = await bcrypt_1.default.genSalt(10);
        const hash = await bcrypt_1.default.hash('admin123', salt);
        const stmt = this.db.prepare('INSERT OR IGNORE INTO admin (username, password_hash) VALUES (?, ?)');
        stmt.run('admin', hash);
    }
    // Admin methods
    async verifyAdmin(username, password) {
        const stmt = this.db.prepare('SELECT password_hash FROM admin WHERE username = ?');
        const admin = stmt.get(username);
        if (!admin)
            return false;
        return await bcrypt_1.default.compare(password, admin.password_hash);
    }
    // Clients methods
    getClients() {
        const stmt = this.db.prepare('SELECT * FROM clients ORDER BY nom');
        return stmt.all();
    }
    getClientById(id) {
        const stmt = this.db.prepare('SELECT * FROM clients WHERE id = ?');
        return stmt.get(id);
    }
    createClient(client) {
        const stmt = this.db.prepare('INSERT INTO clients (nom, email, telephone) VALUES (?, ?, ?)');
        const result = stmt.run(client.nom, client.email, client.telephone);
        return result.lastInsertRowid;
    }
    // Commandes methods
    getCommandes() {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            ORDER BY c.date_commande DESC
        `);
        return stmt.all();
    }
    getCommandesByStatut(statut) {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            WHERE c.statut = ?
            ORDER BY c.date_commande DESC
        `);
        return stmt.all(statut);
    }
    searchCommandesByClient(search) {
        const stmt = this.db.prepare(`
            SELECT c.*, cl.nom as client_nom 
            FROM commandes c
            JOIN clients cl ON c.client_id = cl.id
            WHERE cl.nom LIKE ?
            ORDER BY c.date_commande DESC
        `);
        return stmt.all(`%${search}%`);
    }
    createCommande(commande) {
        const stmt = this.db.prepare('INSERT INTO commandes (client_id, produit, quantite, prix_unitaire, statut, notes) VALUES (?, ?, ?, ?, ?, ?)');
        const result = stmt.run(commande.client_id, commande.produit, commande.quantite, commande.prix_unitaire, commande.statut, commande.notes);
        return result.lastInsertRowid;
    }
    updateCommandeStatut(id, statut) {
        const stmt = this.db.prepare('UPDATE commandes SET statut = ? WHERE id = ?');
        const result = stmt.run(statut, id);
        return result.changes > 0;
    }
    updateCommande(id, commande) {
        const fields = [];
        const values = [];
        if (commande.client_id !== undefined) {
            fields.push('client_id = ?');
            values.push(commande.client_id);
        }
        if (commande.produit !== undefined) {
            fields.push('produit = ?');
            values.push(commande.produit);
        }
        if (commande.quantite !== undefined) {
            fields.push('quantite = ?');
            values.push(commande.quantite);
        }
        if (commande.prix_unitaire !== undefined) {
            fields.push('prix_unitaire = ?');
            values.push(commande.prix_unitaire);
        }
        if (commande.statut !== undefined) {
            fields.push('statut = ?');
            values.push(commande.statut);
        }
        if (commande.notes !== undefined) {
            fields.push('notes = ?');
            values.push(commande.notes);
        }
        if (fields.length === 0)
            return false;
        values.push(id);
        const stmt = this.db.prepare(`UPDATE commandes SET ${fields.join(', ')} WHERE id = ?`);
        const result = stmt.run(...values);
        return result.changes > 0;
    }
    deleteCommande(id) {
        const stmt = this.db.prepare('DELETE FROM commandes WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
    close() {
        this.db.close();
    }
}
exports.default = DatabaseManager;
