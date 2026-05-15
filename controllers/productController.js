const db = require('../config/db');

// OBTENER TODOS LOS PRODUCTOS
exports.getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, c.nombre AS nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `;
        const [products] = await db.execute(sql);

        res.json({
            status: 'success',
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Error en getAllProducts:", error);
        res.status(500).json({status: 'error', message: 'Error al obtener el catálogo.'});
    }
};

// OBTENER UN PRODUCTO POR ID
exports.getProductById = async (req, res) => {
    try {
        const {id} = req.params;
        const sql = `SELECT * FROM productos WHERE id_producto = ?`;
        const [product] = await db.execute(sql, [id]);

        if (product.length === 0) {
            return res.status(404).json({status: 'error', message: 'Producto no encontrado.'});
        }

        res.json({status: 'success', data: product[0]});
    } catch (error) {
        console.error("Error en getProductById:", error);
        res.status(500).json({status: 'error', message: 'Error al buscar el producto.'});
    }
};

// ACTUALIZAR STOCK DE UN PRODUCTO
exports.updateStock = async (req, res) => {
    try {
        const {id} = req.params;
        const {nuevoStock} = req.body;

        // Validación de seguridad: que sea un número y no sea negativo
        if (nuevoStock === undefined || nuevoStock < 0 || isNaN(nuevoStock)) {
            return res.status(400).json({
                status: 'error',
                message: 'Cantidad de stock no válida.'
            });
        }

        const sql = `UPDATE productos SET stock_disponible = ? WHERE id_producto = ?`;
        const [result] = await db.execute(sql, [nuevoStock, id]);

        // Si no se actualizó ninguna fila, es que el ID no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No se encontró el producto para actualizar.'
            });
        }

        res.json({status: 'success', message: 'Stock actualizado correctamente.'});
    } catch (error) {
        console.error("Error en updateStock:", error);
        res.status(500).json({status: 'error', message: 'Error interno al actualizar el stock.'});
    }
};
