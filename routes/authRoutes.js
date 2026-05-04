const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middlewares/validator');

// Registro: Primero valida los datos, luego registra
router.post('/register', validateRegistration, authController.registerUser);

// Login
router.post('/login', authController.loginUser);

module.exports = router;

