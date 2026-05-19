const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 2. RUTAS 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);         // Para Login y Registro
app.use('/api/productos', productRoutes);    // Para ver los pasteles
app.use('/api/ingredientes', ingredientRoutes); // Para el stock
app.use('/api/pedidos', orderRoutes);      //Para los pedidos

// Añado un manejo de errores que no tenía antes, algo básico pero funcional
app.use((err, req, res, next) => {
    console.error(`Error en la ruta ${req.originalUrl}:`, err.stack);
    res.status(500).send('Algo salió mal en el servidor');
});
   
// 3. Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Baker & Co. Enterprise en puerto ${PORT}`);
});
