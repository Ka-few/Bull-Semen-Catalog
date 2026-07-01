const express = require('express');
const router = express.Router();
const farmersController = require('../controllers/farmers');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/profile', authenticate, authorizeRole('farmer'), farmersController.getProfile);
router.post('/profile', authenticate, authorizeRole('farmer'), farmersController.updateProfile);
router.put('/profile', authenticate, authorizeRole('farmer'), farmersController.updateProfile);

module.exports = router;
