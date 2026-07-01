const { getDb } = require('../db');

// Get all agri-suppliers (optionally sorted by distance)
exports.getAgriSuppliers = async (req, res) => {
    try {
        const db = await getDb();
        const { lat, lng } = req.query;
        let suppliers = await db.all('SELECT * FROM agri_suppliers');

        if (lat && lng) {
            const originLat = parseFloat(lat);
            const originLng = parseFloat(lng);

            suppliers = suppliers.map(supplier => {
                if (supplier.latitude == null || supplier.longitude == null) return supplier;
                const R = 6371;
                const dLat = (supplier.latitude - originLat) * Math.PI / 180;
                const dLon = (supplier.longitude - originLng) * Math.PI / 180;
                const a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(originLat * Math.PI / 180) * Math.cos(supplier.latitude * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                supplier.distance_km = R * c;
                return supplier;
            });

            suppliers.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
        }

        res.json(suppliers);
    } catch (error) {
        console.error('Error fetching agri-suppliers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get current agri-supplier profile
exports.getProfile = async (req, res) => {
    try {
        const db = await getDb();
        const supplier = await db.get('SELECT * FROM agri_suppliers WHERE user_id = ?', [req.user.id]);
        if (!supplier) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(supplier);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create or update agri-supplier profile
exports.updateProfile = async (req, res) => {
    try {
        const { business_name, phone_number, address, latitude, longitude } = req.body;
        const db = await getDb();

        const existing = await db.get('SELECT id FROM agri_suppliers WHERE user_id = ?', [req.user.id]);
        
        if (existing) {
            await db.run(
                `UPDATE agri_suppliers 
                 SET business_name = ?, phone_number = ?, address = ?, latitude = ?, longitude = ? 
                 WHERE user_id = ?`,
                [business_name, phone_number, address, latitude, longitude, req.user.id]
            );
        } else {
            await db.run(
                `INSERT INTO agri_suppliers (user_id, business_name, phone_number, address, latitude, longitude) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [req.user.id, business_name, phone_number, address, latitude, longitude]
            );
        }

        const profile = await db.get('SELECT * FROM agri_suppliers WHERE user_id = ?', [req.user.id]);
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
