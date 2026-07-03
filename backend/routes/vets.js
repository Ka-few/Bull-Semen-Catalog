const express = require('express');
const router = express.Router();
const vetsController = require('../controllers/vets');
const { authenticate, authorizeRole } = require('../middleware/auth');

// Public route to fetch vets
router.get('/', vetsController.getVets);

// Vet registration and profile update
router.post('/register', authenticate, authorizeRole('vet'), vetsController.registerVet);
router.put('/profile', authenticate, authorizeRole('vet'), vetsController.updateVetProfile);

// Admin vet verification
router.put('/:id/verify', authenticate, authorizeRole('admin'), vetsController.verifyVet);

module.exports = router;
