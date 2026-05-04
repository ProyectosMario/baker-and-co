const db = require('../config/db');

// OBTENER TODOS LOS INGREDIENTES (Para el panel de inventario)
exports.getAllIngredients = async (req, res) => {
    try {
        const [ingredients] = await db.execute('SELECT * FROM ingredientes ORDER BY nombre ASC');
        res.json({ status: 'success', data: ingredients });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener inventario.' });
    }
};

// OBTENER LA RECETA DE UN PRODUCTO 
// Esta consulta une Productos -> Receta_Producto -> Ingredientes
exports.getRecipeByProduct = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const sql = `
            SELECT i.nombre, rp.cantidad_necesaria, i.unidad_medida
            FROM receta_producto rp
            JOIN ingredientes i ON rp.id_ingrediente = i.id_ingrediente
            WHERE rp.id_producto = ?
        `;
        const [recipe] = await db.execute(sql, [id_producto]);
        
        if (recipe.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Este producto no tiene receta registrada.' });
        }

        res.json({ status: 'success', data: recipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener la receta.' });
    }
};

// ACTUALIZAR STOCK (Cuando se recibe mercancía)
exports.updateStock = async (req, res) => {
    try {
        const { id_ingrediente, cantidad_añadir } = req.body;
        
        const sql = `UPDATE ingredientes SET stock_actual = stock_actual + ? WHERE id_ingrediente = ?`;
        await db.execute(sql, [cantidad_añadir, id_ingrediente]);

        res.json({ status: 'success', message: 'Stock actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar stock.' });
    }
};