const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');

// Ver todo el stock de ingredientes (Harina, Chocolate, etc.)
router.get('/', ingredientController.getAllIngredients);

// Ver la receta de un producto (Qué ingredientes lleva)
router.get('/receta/:id_producto', ingredientController.getRecipeByProduct);

// Actualizar stock (Entrada de mercancía de proveedores)
router.put('/update-stock', ingredientController.updateStock);

module.exports = router;