const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// Endpoint: POST /api/auth/registrar
router.post('/registrar', registrarUsuario);

// Endpoint: POST /api/auth/login
router.post('/login', loginUsuario);

module.exports = router;