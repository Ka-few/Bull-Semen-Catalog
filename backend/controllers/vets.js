const { getDb } = require('../db');

exports.registerVet = async (req, res) => {
    try {
        const db = await getDb();
        const {
            full_name, phone_number, county, sub_county,
            latitude, longitude, service_radius_km, service_fee,
            certificate_url
        } = req.body;

        // Validate if the user exists and has the 'vet' role
        const user = req.user;
        if (user.role !== 'vet') {
            return res.status(403).json({ error: 'Only veterinarians can register profiles' });
        }

        // Check if the vet profile already exists for this user
        const existingVet = await db.get('SELECT * FROM vets WHERE user_id = ?', [user.id]);
        if (existingVet) {
            return res.status(400).json({ error: 'Vet profile already exists for this user' });
        }

        const result = await db.run(`
      INSERT INTO vets (
        user_id, full_name, phone_number, county, sub_county,
        latitude, longitude, service_radius_km, service_fee, certificate_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            user.id, full_name, phone_number, county, sub_county,
            latitude, longitude, service_radius_km, service_fee, certificate_url
        ]);

        res.status(201).json({ id: result.lastID, message: 'Vet profile created successfully. Awaiting verification.' });
    } catch (error) {
        console.error('Error registering vet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getVets = async (req, res) => {
    try {
        const db = await getDb();
        const { county, verified } = req.query;

        let query = 'SELECT * FROM vets WHERE 1=1';
        let params = [];

        if (county) {
            query += ' AND county = ?';
            params.push(county);
        }

        if (verified !== undefined) {
            // 1 for true, 0 for false in SQLite
            query += ' AND verified = ?';
            const isVerified = verified === 'true' || verified === '1' ? 1 : 0;
            params.push(isVerified);
        }

        const vets = await db.all(query, params);

        res.json(vets);
    } catch (error) {
        console.error('Error fetching vets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyVet = async (req, res) => {
    try {
        const db = await getDb();
        const vetId = req.params.id;
        const { verified } = req.body; // Expects true or false

        const isVerified = verified ? 1 : 0;

        const result = await db.run('UPDATE vets SET verified = ? WHERE id = ?', [isVerified, vetId]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Vet not found' });
        }

        res.json({ message: `Vet ${verified ? 'verified' : 'unverified'} successfully` });
    } catch (error) {
        console.error('Error verifying vet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
