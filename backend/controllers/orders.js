const { getDb } = require('../db');

exports.createOrder = async (req, res) => {
    try {
        const db = await getDb();
        const farmer_id = req.user.id;
        const { vet_id } = req.body;

        if (req.user.role !== 'farmer') {
            return res.status(403).json({ error: 'Only farmers can create orders' });
        }

        // Get cart items
        const cartItems = await db.all(`
      SELECT c.*, b.semen_price 
      FROM carts c 
      JOIN bulls b ON c.bull_id = b.id 
      WHERE c.farmer_id = ?
    `, [farmer_id]);

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total
        let total_amount = 0;
        for (const item of cartItems) {
            total_amount += item.quantity * item.semen_price;
        }

        // Create Order
        const orderResult = await db.run(`
      INSERT INTO orders (farmer_id, vet_id, total_amount) 
      VALUES (?, ?, ?)
    `, [farmer_id, vet_id || null, total_amount]);

        const order_id = orderResult.lastID;

        // Move items to order_items
        for (const item of cartItems) {
            await db.run(`
        INSERT INTO order_items (order_id, bull_id, quantity, unit_price) 
        VALUES (?, ?, ?, ?)
      `, [order_id, item.bull_id, item.quantity, item.semen_price]);
        }

        // Clear cart
        await db.run('DELETE FROM carts WHERE farmer_id = ?', [farmer_id]);

        res.status(201).json({ id: order_id, message: 'Order created successfully', total_amount });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const db = await getDb();
        const farmer_id = req.params.farmerId;
        const role = req.user.role;

        if (role === 'farmer' && req.user.id !== parseInt(farmer_id, 10)) {
            return res.status(403).json({ error: 'Unauthorized to view these orders' });
        }

        // Admin gets all, farmer gets theirs, vet gets assigned to them? Let's just do Farmer for now.
        let orders;
        if (role === 'farmer') {
            orders = await db.all('SELECT * FROM orders WHERE farmer_id = ?', [farmer_id]);
        } else if (role === 'vet') {
            orders = await db.all('SELECT * FROM orders WHERE vet_id = ?', [req.user.id]);
        } else {
            orders = await db.all('SELECT * FROM orders');
        }

        // Attach items
        for (let order of orders) {
            order.items = await db.all(`
        SELECT oi.*, b.name as bull_name 
        FROM order_items oi
        JOIN bulls b ON oi.bull_id = b.id
        WHERE oi.order_id = ?
      `, [order.id]);
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const db = await getDb();
        const orderId = req.params.id;
        const { order_status, payment_status } = req.body;

        const role = req.user.role;
        if (role === 'farmer') {
            return res.status(403).json({ error: 'Farmers cannot update order statuses here' });
        }

        let updates = [];
        let params = [];

        if (order_status) {
            updates.push('order_status = ?');
            params.push(order_status);
        }
        if (payment_status) {
            updates.push('payment_status = ?');
            params.push(payment_status);
        }

        if (updates.length > 0) {
            params.push(orderId);
            await db.run(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
        }

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
