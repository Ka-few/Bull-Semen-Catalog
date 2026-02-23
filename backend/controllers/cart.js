const { getDb } = require('../db');

exports.addToCart = async (req, res) => {
    try {
        const db = await getDb();
        const { bull_id, quantity } = req.body;
        const farmer_id = req.user.id;

        if (req.user.role !== 'farmer') {
            return res.status(403).json({ error: 'Only farmers can add items to cart' });
        }

        // Check if the item is already in the cart
        const existing = await db.get('SELECT * FROM carts WHERE farmer_id = ? AND bull_id = ?', [farmer_id, bull_id]);

        if (existing) {
            // Update quantity
            await db.run('UPDATE carts SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing.id]);
            return res.json({ message: 'Cart updated successfully' });
        }

        // Insert new item
        const result = await db.run('INSERT INTO carts (farmer_id, bull_id, quantity) VALUES (?, ?, ?)', [farmer_id, bull_id, quantity || 1]);

        res.status(201).json({ id: result.lastID, message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const db = await getDb();
        const farmer_id = req.params.farmerId;

        if (req.user.id !== parseInt(farmer_id, 10)) {
            return res.status(403).json({ error: 'Unauthorized to view this cart' });
        }

        const cartItems = await db.all(`
      SELECT c.id as cart_id, c.quantity, b.* 
      FROM carts c 
      JOIN bulls b ON c.bull_id = b.id 
      WHERE c.farmer_id = ?
    `, [farmer_id]);

        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const db = await getDb();
        const cartId = req.params.id;

        // Verify ownership
        const cartItem = await db.get('SELECT * FROM carts WHERE id = ?', [cartId]);
        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (cartItem.farmer_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await db.run('DELETE FROM carts WHERE id = ?', [cartId]);
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
