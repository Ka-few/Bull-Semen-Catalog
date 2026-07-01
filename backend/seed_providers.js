const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (2, 'vet1', 'pass', 'vet'), (3, 'supplier1', 'pass', 'agri-supplier')");
    db.run("INSERT OR IGNORE INTO vets (id, user_id, full_name, phone_number, county, sub_county, latitude, longitude, service_radius_km, service_fee, verified) VALUES (1, 2, 'Dr. Smith', '0700000001', 'Nairobi', 'Westlands', -1.2921, 36.8219, 50, 1500, 1)");
    db.run("INSERT OR IGNORE INTO agri_suppliers (id, user_id, business_name, phone_number, address, latitude, longitude) VALUES (1, 3, 'Agri Vet Depot', '0700000002', 'CBD Nairobi', -1.2833, 36.8167)");
    console.log('Seeded Vet and Supplier');
});
