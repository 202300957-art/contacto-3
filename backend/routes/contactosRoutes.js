const express = require('express');
const router = express.Router();
const { 
    crearContacto, 
    obtenerMisContactos, 
    actualizarContacto, 
    eliminarContacto 
} = require('../controllers/contactosController');
const { verificarToken } = require('../middlewares/authMiddleware'); // Importamos tu portero

// Todas las rutas aquí estarán protegidas por verificarToken
router.post('/', verificarToken, crearContacto);
router.get('/', verificarToken, obtenerMisContactos);
router.put('/:id', verificarToken, actualizarContacto);
router.delete('/:id', verificarToken, eliminarContacto);

module.exports = router;