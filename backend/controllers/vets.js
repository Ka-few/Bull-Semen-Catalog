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
        const { county, verified, lat, lng, radius_km } = req.query;

        let query = 'SELECT * FROM vets WHERE 1=1';
        let params = [];

        if (county) {
            query += ' AND county = ?';
            params.push(county);
        }

        if (verified !== undefined) {
            query += ' AND verified = ?';
            const isVerified = verified === 'true' || verified === '1' ? 1 : 0;
            params.push(isVerified);
        }

        let vets = await db.all(query, params);

        // Compute distance for all vets if lat/lng given (no radius cutoff)
        if (lat && lng) {
            const originLat = parseFloat(lat);
            const originLng = parseFloat(lng);

            vets = vets.map(vet => {
                if (vet.latitude == null || vet.longitude == null) return vet;
                const R = 6371;
                const dLat = (vet.latitude - originLat) * Math.PI / 180;
                const dLon = (vet.longitude - originLng) * Math.PI / 180;
                const a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(originLat * Math.PI / 180) * Math.cos(vet.latitude * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                vet.distance_km = R * c;
                return vet;
            });

            // Sort by distance
            vets.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
        }

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

exports.updateVetProfile = async (req, res) => {
    try {
        const db = await getDb();
        const {
            full_name, phone_number, county, sub_county,
            latitude, longitude, service_fee
        } = req.body;

        const user = req.user;

        const existingVet = await db.get('SELECT * FROM vets WHERE user_id = ?', [user.id]);
        if (!existingVet) {
            return res.status(404).json({ error: 'Vet profile not found' });
        }

        await db.run(`
            UPDATE vets SET
                full_name = COALESCE(?, full_name),
                phone_number = COALESCE(?, phone_number),
                county = COALESCE(?, county),
                sub_county = COALESCE(?, sub_county),
                latitude = COALESCE(?, latitude),
                longitude = COALESCE(?, longitude),
                service_fee = COALESCE(?, service_fee)
            WHERE user_id = ?
        `, [
            full_name, phone_number, county, sub_county,
            latitude, longitude, service_fee, user.id
        ]);

        res.json({ message: 'Vet profile updated successfully' });
    } catch (error) {
        console.error('Error updating vet profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
