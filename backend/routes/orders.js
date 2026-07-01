const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/', authenticate, authorizeRole('farmer'), ordersController.createOrder);
router.get('/single/:id', authenticate, ordersController.getOrderById);
router.get('/my-orders', authenticate, ordersController.getMyOrders);
router.get('/:farmerId', authenticate, ordersController.getOrders);
router.put('/:id/status', authenticate, ordersController.updateOrderStatus);
router.put('/:id/pay', authenticate, authorizeRole('farmer'), ordersController.payOrder);

module.exports = router;
