const express = require('express');
const router = express.Router();
const agriSuppliersController = require('../controllers/agri_suppliers');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', authenticate, agriSuppliersController.getAgriSuppliers);
router.get('/profile', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.getProfile);
router.post('/profile', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.updateProfile);
router.put('/profile', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.updateProfile);

router.get('/inventory', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.getInventory);
router.put('/inventory', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.updateInventory);
router.delete('/inventory/:bullId', authenticate, authorizeRole('agri-supplier'), agriSuppliersController.deleteInventory);

module.exports = router;
