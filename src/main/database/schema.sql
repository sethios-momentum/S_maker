-- Table admin
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table clients
CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE,
    telephone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table commandes
CREATE TABLE IF NOT EXISTS commandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    produit TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    prix_unitaire REAL NOT NULL,
    statut TEXT CHECK(statut IN ('EN_COURS', 'PRET', 'LIVRE')) DEFAULT 'EN_COURS',
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Insertion d'un admin par défaut (mot de passe: admin123)
INSERT OR IGNORE INTO admin (username, password_hash) 
VALUES ('admin', '$2b$10$YourHashedPasswordHere');