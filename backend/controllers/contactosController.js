const pool = require('../database/db');

// Crear un nuevo contacto
const crearContacto = async (req, res) => {
    // req.usuario.id viene del token validado por el middleware
    const usuario_id = req.usuario.id; 
    const { 
        nombres, apellidos, celular, telefono_fijo, correo, 
        direccion_casa, direccion_trabajo, genero, fecha_nacimiento, relacion, favorito 
    } = req.body;

    // Validación mínima según tu rúbrica
    if (!nombres || !apellidos) {
        return res.status(400).json({ error: 'Nombres y apellidos son obligatorios.' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO contactos 
            (usuario_id, nombres, apellidos, celular, telefono_fijo, correo, direccion_casa, direccion_trabajo, genero, fecha_nacimiento, relacion, favorito) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [usuario_id, nombres, apellidos, celular, telefono_fijo, correo, direccion_casa, direccion_trabajo, genero, fecha_nacimiento, relacion, favorito || false]
        );

        res.status(201).json({ mensaje: 'Contacto creado exitosamente', contacto: result.rows[0] });
    } catch (error) {
        console.error('Error al crear contacto:', error.message);
        res.status(500).json({ error: 'Error interno al crear el contacto.' });
    }
};

// Obtener solo los contactos del usuario logueado
const obtenerMisContactos = async (req, res) => {
    const usuario_id = req.usuario.id; // Filtro de privacidad

    try {
        const result = await pool.query('SELECT * FROM contactos WHERE usuario_id = $1 ORDER BY favorito DESC, nombres ASC', [usuario_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener contactos:', error.message);
        res.status(500).json({ error: 'Error interno al obtener los contactos.' });
    }
};

// Actualizar un contacto existente (validando que pertenezca al usuario)
const actualizarContacto = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario.id;
    const { 
        nombres, apellidos, celular, telefono_fijo, correo, 
        direccion_casa, direccion_trabajo, genero, fecha_nacimiento, relacion, favorito 
    } = req.body;

    if (!nombres || !apellidos) {
        return res.status(400).json({ error: 'Nombres y apellidos son obligatorios.' });
    }

    try {
        // Validamos que el contacto pertenezca al usuario logueado
        const contactoExistente = await pool.query('SELECT * FROM contactos WHERE id = $1 AND usuario_id = $2', [id, usuario_id]);
        if (contactoExistente.rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado o no autorizado.' });
        }

        const result = await pool.query(
            `UPDATE contactos SET 
            nombres = $1, apellidos = $2, celular = $3, telefono_fijo = $4, correo = $5, 
            direccion_casa = $6, direccion_trabajo = $7, genero = $8, fecha_nacimiento = $9, 
            relacion = $10, favorito = $11 
            WHERE id = $12 AND usuario_id = $13 RETURNING *`,
            [nombres, apellidos, celular, telefono_fijo, correo, direccion_casa, direccion_trabajo, genero, fecha_nacimiento, relacion, favorito, id, usuario_id]
        );

        res.status(200).json({ mensaje: 'Contacto actualizado exitosamente', contacto: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar contacto:', error.message);
        res.status(500).json({ error: 'Error interno al actualizar el contacto.' });
    }
};

// Eliminar un contacto
const eliminarContacto = async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.usuario.id;

    try {
        const contactoExistente = await pool.query('SELECT * FROM contactos WHERE id = $1 AND usuario_id = $2', [id, usuario_id]);
        if (contactoExistente.rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado o no autorizado.' });
        }

        await pool.query('DELETE FROM contactos WHERE id = $1 AND usuario_id = $2', [id, usuario_id]);
        res.status(200).json({ mensaje: 'Contacto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar contacto:', error.message);
        res.status(500).json({ error: 'Error interno al eliminar el contacto.' });
    }
};

module.exports = {
    crearContacto,
    obtenerMisContactos,
    actualizarContacto,
    eliminarContacto
};