const express = require('express');
const router = express.Router();
const vetsController = require('../controllers/vets');
const { authenticate, authorizeRole } = require('../middleware/auth');

// Public route to fetch vets
router.get('/', vetsController.getVets);

// Vet registration
router.post('/register', authenticate, authorizeRole('vet'), vetsController.registerVet);

// Admin vet verification
router.put('/:id/verify', authenticate, authorizeRole('admin'), vetsController.verifyVet);

module.exports = router;
