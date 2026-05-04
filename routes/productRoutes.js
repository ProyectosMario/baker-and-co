const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Obtener todos los productos (Catálogo)
router.get('/', productController.getAllProducts);

// Obtener detalle de un producto específico
router.get('/:id', productController.getProductById);

// Ruta para actualizar stock (usamos PATCH porque solo modificamos un campo)
router.patch('/:id/stock', productController.updateStock);

module.exports = router;
