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

    // Seed dummy data for demo/MVP
    const seedPassword = await bcrypt.hash('password123', 10);

    // Seed 5 Bulls
    const bullCountResult = await db.get("SELECT COUNT(*) as count FROM bulls");
    if (bullCountResult.count === 0) {
        const dummyBulls = [
            ['Sir Lancelot', 'Holstein', 'H-12345', '2020-01-15', 35.5, 4.2, 3.4, 9.5, 1.2, 2500, 2.5, 1500, 100, 'https://images.unsplash.com/photo-1546452285-05517173e614?q=80&w=2000&auto=format&fit=crop'],
            ['Mighty Taurus', 'Jersey', 'J-98765', '2019-05-20', 28.0, 5.5, 4.0, 8.0, 1.0, 2200, 2.8, 1200, 50, 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2000&auto=format&fit=crop'],
            ['Goliath', 'Friesian', 'F-55555', '2021-03-10', 32.0, 3.9, 3.2, 10.0, 1.5, 2600, 2.6, 1350, 75, 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2000&auto=format&fit=crop'],
            ['Red Ranger', 'Ayrshire', 'A-11111', '2022-08-05', 30.5, 4.1, 3.5, 9.0, 1.3, 2400, 2.7, 1400, 200, 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2000&auto=format&fit=crop'],
            ['Thunder', 'Guernsey', 'G-22222', '2020-11-30', 29.0, 4.8, 3.8, 8.5, 1.1, 2300, 2.9, 1300, 150, 'https://images.unsplash.com/photo-1588661660309-8d7ef2049e6b?q=80&w=2000&auto=format&fit=crop']
        ];
        
        for (const bull of dummyBulls) {
            await db.run(
                `INSERT INTO bulls (name, breed, registration_number, date_of_birth, milk_yield, butterfat_percent, protein_percent, calving_ease, fertility_index, tpi, scs, semen_price, stock_available, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                bull
            );
        }
        console.log('Seeded 5 dummy bulls');
    }

    // Seed 3 Vets
    const vetCountResult = await db.get("SELECT COUNT(*) as count FROM vets");
    if (vetCountResult.count === 0) {
        const dummyVets = [
            { username: 'vet_john', name: 'Dr. John Doe', phone: '0711111111', county: 'Nairobi', sub: 'Westlands', lat: -1.264, lng: 36.804, fee: 1500 },
            { username: 'vet_jane', name: 'Dr. Jane Smith', phone: '0722222222', county: 'Kiambu', sub: 'Thika', lat: -1.033, lng: 37.069, fee: 2000 },
            { username: 'vet_peter', name: 'Dr. Peter Kamau', phone: '0733333333', county: 'Nakuru', sub: 'Naivasha', lat: -0.717, lng: 36.431, fee: 1800 }
        ];

        for (const vet of dummyVets) {
            await db.run(
                "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, 'vet')",
                [vet.username, seedPassword]
            );
            
            const user = await db.get("SELECT id FROM users WHERE username = ?", [vet.username]);
            
            if (user) {
                await db.run(
                    "INSERT OR IGNORE INTO vets (user_id, full_name, phone_number, county, sub_county, latitude, longitude, service_radius_km, service_fee, verified, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [user.id, vet.name, vet.phone, vet.county, vet.sub, vet.lat, vet.lng, 50, vet.fee, 1, 4.5]
                );
            }
        }
        console.log('Seeded 3 dummy vets');
    }

    // Seed 3 Agri Suppliers
    const supplierCountResult = await db.get("SELECT COUNT(*) as count FROM agri_suppliers");
    if (supplierCountResult.count === 0) {
        const dummySuppliers = [
            { username: 'sup_agro', name: 'Agrovet Central', phone: '0744444444', address: 'Nairobi CBD', lat: -1.286, lng: 36.821 },
            { username: 'sup_rift', name: 'Rift Valley Supplies', phone: '0755555555', address: 'Nakuru Town', lat: -0.303, lng: 36.080 },
            { username: 'sup_mt', name: 'Mt Kenya Genetics', phone: '0766666666', address: 'Nyeri Center', lat: -0.416, lng: 36.951 }
        ];

        for (const sup of dummySuppliers) {
            await db.run(
                "INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, 'agri-supplier')",
                [sup.username, seedPassword]
            );
            
            const user = await db.get("SELECT id FROM users WHERE username = ?", [sup.username]);
            
            if (user) {
                await db.run(
                    "INSERT OR IGNORE INTO agri_suppliers (user_id, business_name, phone_number, address, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
                    [user.id, sup.name, sup.phone, sup.address, sup.lat, sup.lng]
                );
            }
        }
        console.log('Seeded 3 dummy agri-suppliers');
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
