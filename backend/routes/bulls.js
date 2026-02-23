const express = require('express');
const router = express.Router();
const bullsController = require('../controllers/bulls');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', bullsController.getAllBulls);
router.get('/:id', bullsController.getBullById);

// Admin only routes
router.post('/', authenticate, authorizeRole('admin'), bullsController.createBull);
router.put('/:id', authenticate, authorizeRole('admin'), bullsController.updateBull);
router.delete('/:id', authenticate, authorizeRole('admin'), bullsController.deleteBull);

module.exports = router;
