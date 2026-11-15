const pool = require('../database/db');
const bcrypt = require('bcryptjs'); // Necesario para encriptar la contraseña del nuevo usuario

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

// Crear un nuevo usuario desde el panel admin (Ruta POST faltante)
const crearUsuarioAdmin = async (req, res) => {
    const { nombres, apellidos, email, password, rol_id } = req.body;

    try {
        // 1. Verificar si el correo ya existe
        const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado en el sistema.' });
        }

        // 2. Encriptar la contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Guardar el usuario en PostgreSQL
        const result = await pool.query(
            'INSERT INTO usuarios (nombres, apellidos, email, password, rol_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombres, apellidos, email, rol_id',
            [nombres, apellidos, email, hashedPassword, rol_id]
        );

        res.status(201).json({ mensaje: 'Usuario creado exitosamente', usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al crear usuario.' });
    }
};

// Eliminar un usuario desde el panel admin (Ruta DELETE faltante)
const eliminarUsuarioAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al eliminar usuario.' });
    }
};

// Exportamos todas las funciones para que las rutas puedan utilizarlas
module.exports = {
    obtenerUsuarios,
    actualizarUsuarioAdmin,
    crearUsuarioAdmin,
    eliminarUsuarioAdmin
};