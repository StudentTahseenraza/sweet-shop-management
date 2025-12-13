-- SQLite schema for testing
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'CUSTOMER',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sweets (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER DEFAULT 0,
    imageUrl TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    sweetId TEXT NOT NULL,
    userId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    totalPrice REAL NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sweetId) REFERENCES sweets(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restocks (
    id TEXT PRIMARY KEY,
    sweetId TEXT NOT NULL,
    userId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sweetId) REFERENCES sweets(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sweets_category ON sweets(category);
CREATE INDEX IF NOT EXISTS idx_purchases_userId ON purchases(userId);
CREATE INDEX IF NOT EXISTS idx_purchases_sweetId ON purchases(sweetId);
CREATE INDEX IF NOT EXISTS idx_restocks_sweetId ON restocks(sweetId);