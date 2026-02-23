const { getDb } = require('../db');

exports.getAllBulls = async (req, res) => {
    try {
        const { breed, minMilkYield, calvingEase, maxPrice } = req.query;
        const db = await getDb();

        let query = 'SELECT * FROM bulls WHERE 1=1';
        let params = [];

        if (breed) {
            query += ' AND breed = ?';
            params.push(breed);
        }
        if (minMilkYield) {
            query += ' AND milk_yield >= ?';
            params.push(minMilkYield);
        }
        if (calvingEase) {
            query += ' AND calving_ease >= ?';
            params.push(calvingEase);
        }
        if (maxPrice) {
            query += ' AND semen_price <= ?';
            params.push(maxPrice);
        }

        const bulls = await db.all(query, params);
        res.json(bulls);
    } catch (error) {
        console.error('Error fetching bulls:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBullById = async (req, res) => {
    try {
        const db = await getDb();
        const bull = await db.get('SELECT * FROM bulls WHERE id = ?', [req.params.id]);

        if (!bull) {
            return res.status(404).json({ error: 'Bull not found' });
        }

        res.json(bull);
    } catch (error) {
        console.error('Error fetching bull:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createBull = async (req, res) => {
    try {
        const db = await getDb();
        const {
            name, breed, registration_number, date_of_birth, sire, dam,
            milk_yield, butterfat_percent, protein_percent, calving_ease,
            fertility_index, tpi, scs, semen_price, stock_available,
            image_url, certificate_url
        } = req.body;

        const result = await db.run(`
      INSERT INTO bulls (
        name, breed, registration_number, date_of_birth, sire, dam,
        milk_yield, butterfat_percent, protein_percent, calving_ease,
        fertility_index, tpi, scs, semen_price, stock_available,
        image_url, certificate_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            name, breed, registration_number, date_of_birth, sire, dam,
            milk_yield, butterfat_percent, protein_percent, calving_ease,
            fertility_index, tpi, scs, semen_price, stock_available || 0,
            image_url, certificate_url
        ]);

        res.status(201).json({ id: result.lastID, message: 'Bull created successfully' });
    } catch (error) {
        console.error('Error creating bull:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateBull = async (req, res) => {
    try {
        const db = await getDb();
        const {
            name, breed, registration_number, date_of_birth, sire, dam,
            milk_yield, butterfat_percent, protein_percent, calving_ease,
            fertility_index, tpi, scs, semen_price, stock_available,
            image_url, certificate_url
        } = req.body;

        const result = await db.run(`
      UPDATE bulls SET
        name = COALESCE(?, name),
        breed = COALESCE(?, breed),
        registration_number = COALESCE(?, registration_number),
        date_of_birth = COALESCE(?, date_of_birth),
        sire = COALESCE(?, sire),
        dam = COALESCE(?, dam),
        milk_yield = COALESCE(?, milk_yield),
        butterfat_percent = COALESCE(?, butterfat_percent),
        protein_percent = COALESCE(?, protein_percent),
        calving_ease = COALESCE(?, calving_ease),
        fertility_index = COALESCE(?, fertility_index),
        tpi = COALESCE(?, tpi),
        scs = COALESCE(?, scs),
        semen_price = COALESCE(?, semen_price),
        stock_available = COALESCE(?, stock_available),
        image_url = COALESCE(?, image_url),
        certificate_url = COALESCE(?, certificate_url)
      WHERE id = ?
    `, [
            name, breed, registration_number, date_of_birth, sire, dam,
            milk_yield, butterfat_percent, protein_percent, calving_ease,
            fertility_index, tpi, scs, semen_price, stock_available,
            image_url, certificate_url, req.params.id
        ]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Bull not found' });
        }

        res.json({ message: 'Bull updated successfully' });
    } catch (error) {
        console.error('Error updating bull:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteBull = async (req, res) => {
    try {
        const db = await getDb();
        const result = await db.run('DELETE FROM bulls WHERE id = ?', [req.params.id]);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Bull not found' });
        }

        res.json({ message: 'Bull deleted successfully' });
    } catch (error) {
        console.error('Error deleting bull:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
