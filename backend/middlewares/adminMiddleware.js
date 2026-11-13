const soloAdmin = (req, res, next) => {
    // req.usuario viene del authMiddleware previo
    if (req.usuario && req.usuario.rol_id === 1) {
        next(); // Es administrador, puede pasar
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
};

module.exports = { soloAdmin };