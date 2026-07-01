const { getDb } = require('../db');

// Get current farmer profile
exports.getProfile = async (req, res) => {
    try {
        const db = await getDb();
        const farmer = await db.get('SELECT * FROM farmers WHERE user_id = ?', [req.user.id]);
        if (!farmer) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(farmer);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create or update farmer profile
exports.updateProfile = async (req, res) => {
    try {
        const { full_name, phone_number, latitude, longitude } = req.body;
        const db = await getDb();

        const existing = await db.get('SELECT id FROM farmers WHERE user_id = ?', [req.user.id]);
        
        if (existing) {
            await db.run(
                `UPDATE farmers 
                 SET full_name = ?, phone_number = ?, latitude = ?, longitude = ? 
                 WHERE user_id = ?`,
                [full_name, phone_number, latitude, longitude, req.user.id]
            );
        } else {
            await db.run(
                `INSERT INTO farmers (user_id, full_name, phone_number, latitude, longitude) 
                 VALUES (?, ?, ?, ?, ?)`,
                [req.user.id, full_name, phone_number, latitude, longitude]
            );
        }

        const profile = await db.get('SELECT * FROM farmers WHERE user_id = ?', [req.user.id]);
        res.json(profile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
