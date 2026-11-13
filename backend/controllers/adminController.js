const pool = require('../database/db');

// Listar todos los usuarios del sistema
const obtenerUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombres, apellidos, email, rol_id, estado, creado_en FROM usuarios ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Cambiar rol o estado (dar de baja) de un usuario
const actualizarUsuarioAdmin = async (req, res) => {
    const { id } = req.params;
    const { rol_id, estado } = req.body;

    try {
        const result = await pool.query(
            'UPDATE usuarios SET rol_id = COALESCE($1, rol_id), estado = COALESCE($2, estado) WHERE id = $3 RETURNING id, nombres, email, rol_id, estado',
            [rol_id, estado, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ mensaje: 'Usuario actualizado por el administrador', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

module.exports = {
    obtenerUsuarios,
    actualizarUsuarioAdmin
};