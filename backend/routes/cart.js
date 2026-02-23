const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.post('/', authenticate, authorizeRole('farmer'), cartController.addToCart);
router.get('/:farmerId', authenticate, cartController.getCart);
router.delete('/:id', authenticate, authorizeRole('farmer'), cartController.removeFromCart);

module.exports = router;
