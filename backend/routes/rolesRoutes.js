const express = require('express');
const router = express.Router();
const { obtenerRoles } = require('../controllers/rolesController');

// Endpoint: GET /api/roles
router.get('/', obtenerRoles);

module.exports = router;