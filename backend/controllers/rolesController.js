const pool = require('../database/db');

const obtenerRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre FROM roles ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener roles:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al consultar roles' });
    }
};

module.exports = {
    obtenerRoles
};