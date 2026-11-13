const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./database/db');

// Inicializar la app
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: '¡Servidor Backend de Contactos funcionando!' });
});

// Registrar Rutas
app.use('/api/roles', require('./routes/rolesRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contactos', require('./routes/contactosRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});