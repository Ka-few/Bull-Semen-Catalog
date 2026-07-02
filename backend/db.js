const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'database.sqlite');

async function initializeDb() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON;');

    // Create Users table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('farmer', 'vet', 'admin', 'agri-supplier')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Create Farmers table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS farmers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // Create Agri-Suppliers table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS agri_suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      business_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // Create Bulls table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS bulls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      breed TEXT NOT NULL,
      registration_number TEXT UNIQUE,
      date_of_birth DATE,
      sire TEXT,
      dam TEXT,
      milk_yield REAL,
      butterfat_percent REAL,
      protein_percent REAL,
      calving_ease REAL,
      fertility_index REAL,
      tpi REAL,
      scs REAL,
      semen_price REAL NOT NULL,
      stock_available INTEGER DEFAULT 0,
      image_url TEXT,
      certificate_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // Create Vets table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS vets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      county TEXT NOT NULL,
      sub_county TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      service_radius_km REAL,
      service_fee REAL,
      certificate_url TEXT,
      verified BOOLEAN DEFAULT 0,
      rating REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

    // Create Cart table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      bull_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY(farmer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(bull_id) REFERENCES bulls(id) ON DELETE CASCADE
    );
  `);

    // Create Orders table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id INTEGER NOT NULL,
      vet_id INTEGER,
      agri_supplier_id INTEGER,
      delivery_lat REAL,
      delivery_lng REAL,
      total_amount REAL NOT NULL,
      payment_status TEXT CHECK(payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
      order_status TEXT CHECK(order_status IN ('pending', 'processing', 'allocated', 'fetched_by_vet', 'completed', 'cancelled')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(farmer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(vet_id) REFERENCES vets(id) ON DELETE SET NULL,
      FOREIGN KEY(agri_supplier_id) REFERENCES agri_suppliers(id) ON DELETE SET NULL
    );
  `);

    // Create Order Items table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      bull_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY(bull_id) REFERENCES bulls(id) ON DELETE CASCADE
    );
  `);

    // Create Agri-Supplier Inventory table
    await db.exec(`
    CREATE TABLE IF NOT EXISTS agri_supplier_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agri_supplier_id INTEGER NOT NULL,
      bull_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(agri_supplier_id) REFERENCES agri_suppliers(id) ON DELETE CASCADE,
      FOREIGN KEY(bull_id) REFERENCES bulls(id) ON DELETE CASCADE,
      UNIQUE(agri_supplier_id, bull_id)
    );
  `);

    // Seed default admin if not exists
    const existingAdmin = await db.get("SELECT * FROM users WHERE username = 'admin'");
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('securepassword', 10);
        await db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')",
            ['admin', hashedPassword]
        );
        console.log('Seeded default admin user');
    }

    return db;
}

let dbInstance = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = await initializeDb();
    }
    return dbInstance;
}

module.exports = { getDb };
