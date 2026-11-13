const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importamos JWT

const registrarUsuario = async (req, res) => {

    const { nombres, apellidos, email, password, rol_id } = req.body;
    if (!rol_id) return res.status(400).json({ error: 'El rol es obligatorio.' });

    try {
        const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (usuarioExistente.rows.length > 0) return res.status(400).json({ error: 'Este correo electrónico ya está en uso.' });

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const nuevoUsuario = await pool.query(
            'INSERT INTO usuarios (nombres, apellidos, email, password, rol_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombres, apellidos, email, rol_id',
            [nombres, apellidos, email, passwordEncriptada, rol_id]
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: nuevoUsuario.rows[0] });
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
};

// NUEVA FUNCIÓN: Login
const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar si el usuario existe por su email
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const usuario = result.rows[0];

        // 2. Comparar la contraseña ingresada con la encriptada en la BD
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // 3. Generar el JSON Web Token (JWT)
        // Guardamos el 'id' y 'rol_id' dentro del token para usarlos después en la privacidad de contactos
        const token = jwt.sign(
            { id: usuario.id, rol_id: usuario.rol_id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // El token durará 2 horas
        );

        // 4. Enviar el token al frontend
        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol_id: usuario.rol_id
            }
        });
    } catch (error) {
        console.error('Error en el login:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario // Exportamos la nueva función
};