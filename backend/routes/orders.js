const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/', authenticate, authorizeRole('farmer'), ordersController.createOrder);
router.get('/:farmerId', authenticate, ordersController.getOrders);
router.put('/:id/status', authenticate, authorizeRole('admin', 'vet'), ordersController.updateOrderStatus);

module.exports = router;
