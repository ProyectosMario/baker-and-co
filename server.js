const express = require('express');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql2'); 
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DB ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'baker_co_enterprise',
    port: 14939
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- SUSTITUCIÓN: RUTAS DE AUTENTICACIÓN REALES ---

// 1. Registro (Inserción de datos + Control de errores)
app.post('/api/auth/register', (req, res) => {
    const { nombre_completo, email, password, anio_nacimiento } = req.body;

    if (!nombre_completo || !email || password.length < 8) {
        return res.status(400).json({ status: 'error', message: 'Datos inválidos o contraseña corta.' });
    }

    // Usamos 'identificador_acceso' y 'password_hash' 
    const query = "INSERT INTO usuarios (nombre_completo, identificador_acceso, password_hash, anio_nacimiento) VALUES (?, ?, ?, ?)";
    db.query(query, [nombre_completo, email, password, anio_nacimiento], (err, result) => {
        if (err) {
            console.error("Error MySQL:", err);
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ status: 'error', message: 'El email ya existe.' });
            return res.status(500).json({ status: 'error', message: 'Error en la base de datos.' });
        }
        res.json({ status: 'success', message: 'Usuario creado correctamente.' });
    });
});

// 2. Login 
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Buscamos por 'identificador_acceso' y validamos 'password_hash'
    const query = "SELECT id_usuario, nombre_completo, identificador_acceso FROM usuarios WHERE identificador_acceso = ? AND password_hash = ?";
    
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error("Error MySQL:", err);
            return res.status(500).json({ status: 'error', message: 'Error en el servidor.' });
        }
        
        if (results.length > 0) {
            res.json({ 
                status: 'success', 
                user: { 
                    id: results[0].id_usuario, 
                    nombre: results[0].nombre_completo, 
                    email: results[0].identificador_acceso 
                } 
            });
        } else {
            res.status(401).json({ status: 'error', message: 'Email o contraseña incorrectos.' });
        }
    });
});

const productRoutes = require('./routes/productRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
app.use('/api/productos', productRoutes);
app.use('/api/ingredientes', ingredientRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Baker & Co Enterprise listo en http://localhost:${PORT}`);
});
