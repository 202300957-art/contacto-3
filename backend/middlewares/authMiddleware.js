const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Obtener el token del encabezado (header) de la petición
    const token = req.header('Authorization');

    // Si el usuario no envía token, se le rechaza en la puerta
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token de autenticación.' });
    }

    try {
        // 2. Limpiar el string (El estándar es que el token venga con el prefijo "Bearer ")
        const tokenLimpio = token.replace('Bearer ', '');

        // 3. Verificar si el token es válido y fue firmado con nuestra clave secreta
        const payload = jwt.verify(tokenLimpio, process.env.JWT_SECRET);

        // 4. Guardar los datos extraídos del token (id, rol_id) en el objeto 'req'
        // Esto es clave para la privacidad de los contactos que exige la rúbrica
        req.usuario = payload;

        // 5. Dar luz verde para pasar a la ruta solicitada
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

module.exports = {
    verificarToken
};