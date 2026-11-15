const express = require('express');
const router = express.Router();
const { obtenerUsuarios, actualizarUsuarioAdmin, crearUsuarioAdmin, eliminarUsuarioAdmin } = require('../controllers/adminController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloAdmin } = require('../middlewares/adminMiddleware');

// Ambos middlewares combinados: Primero verifica que esté logueado, y luego que sea Admin
router.get('/usuarios', verificarToken, soloAdmin, obtenerUsuarios);
router.put('/usuarios/:id', verificarToken, soloAdmin, actualizarUsuarioAdmin);
router.post('/usuarios', verificarToken, soloAdmin, crearUsuarioAdmin);
router.delete('/usuarios/:id', verificarToken, soloAdmin, eliminarUsuarioAdmin);

module.exports = router;