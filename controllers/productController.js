const db = require('../config/db');

// OBTENER TODOS LOS PRODUCTOS
exports.getAllProducts = async (req, res) => {
    try {
        // Hacemos un JOIN para traer el nombre de la categoría, no solo el ID
        const sql = `
            SELECT p.*, c.nombre AS nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.stock_disponible > 0
        `;
        const [products] = await db.execute(sql);
        
        res.json({ 
            status: 'success', 
            count: products.length,
            data: products 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el catálogo.' });
    }
};

// OBTENER UN PRODUCTO POR ID (Útil para ver detalles o recetas)
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `SELECT * FROM productos WHERE id_producto = ?`;
        const [product] = await db.execute(sql, [id]);

        if (product.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
        }

        res.json({ status: 'success', data: product[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al buscar el producto.' });
    }
};

// ACTUALIZAR STOCK DE UN PRODUCTO
exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoStock } = req.body; // Recibimos el número desde el frontend

        const sql = `UPDATE productos SET stock_disponible = ? WHERE id_producto = ?`;
        await db.execute(sql, [nuevoStock, id]);

        res.json({ status: 'success', message: 'Stock actualizado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el stock.' });
    }
};