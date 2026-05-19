const db = require('../config/db');

// 1. CREAR PEDIDO E HISTÓRICO DE VENTAS (RF8)
exports.createOrder = async (req, res) => {
    try {
        const { id_usuario, productos } = req.body; 
        // productos: [{ id_producto, cantidad, precio_unitario_venta }]

        if (!id_usuario || !productos || productos.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Datos incompletos o carrito vacío.' });
        }

        // Insertar pedido base (estado por defecto: 'recibido')
        const sqlPedido = `INSERT INTO pedidos (id_usuario, estado) VALUES (?, 'recibido')`;
        const [resultPedido] = await db.execute(sqlPedido, [id_usuario]);
        const id_pedido = resultPedido.insertId;

        // Registrar cada producto en detalles guardando el precio unitario exacto de este momento 
        const sqlDetalle = `INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario_venta) VALUES (?, ?, ?, ?)`;
        
        for (const item of productos) {
            await db.execute(sqlDetalle, [id_pedido, item.id_producto, item.cantidad, item.precio_unitario_venta]);
        }

        res.status(201).json({ 
            status: 'success', 
            message: 'Pedido enviado correctamente al obrador.', 
            id_pedido 
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ status: 'error', message: 'Error interno en el servidor.' });
    }
};

// 2. OBTENER TODOS LOS PEDIDOS (Para el Panel del Empleado y Admin)
exports.getAllOrders = async (req, res) => {
    try {
        // Trae los pedidos con el nombre del cliente y el empleado asignado si lo hubiera
        const sql = `
            SELECT p.*, u.nombre_completo AS cliente, emp.nombre_completo AS empleado
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            LEFT JOIN usuarios emp ON p.id_empleado = emp.id_usuario
            ORDER BY p.fecha_pedido DESC
        `;
        const [orders] = await db.execute(sql);
        res.json({ status: 'success', data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener pedidos.' });
    }
};

// 3. ACTUALIZAR ESTADO DEL PEDIDO ('en_preparacion', 'listo', 'entregado')
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id_pedido, nuevo_estado } = req.body;
        const sql = `UPDATE pedidos SET estado = ? WHERE id_pedido = ?`;
        await db.execute(sql, [nuevo_estado, id_pedido]);
        res.json({ status: 'success', message: `Pedido actualizado a: ${nuevo_estado}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al actualizar el estado.' });
    }
};

// 4. ASIGNAR EMPLEADO A UN PEDIDO (Rol Admin)
exports.assignEmployee = async (req, res) => {
    try {
        const { id_pedido, id_empleado } = req.body;
        const sql = `UPDATE pedidos SET id_empleado = ? WHERE id_pedido = ?`;
        await db.execute(sql, [id_empleado, id_pedido]);
        res.json({ status: 'success', message: 'Empleado asignado al pedido con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al asignar empleado.' });
    }
};

// 5. CONSULTAR HISTÓRICO DE UN USUARIO ESPECÍFICO (Para el perfil del cliente)
exports.getOrdersByUser = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const sql = `SELECT * FROM pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC`;
        const [orders] = await db.execute(sql, [id_usuario]);
        res.json({ status: 'success', data: orders });
    } catch (error) {
        console.error("Error al obtener pedidos del usuario:", error);
        res.status(500).json({ status: 'error', message: 'Error al consultar tus pedidos.' });
    }
};

// 6. CONSULTAR UN PEDIDO ESPECÍFICO (Para la pantalla de confirmación/ticket)
exports.getOrderById = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const sqlPedido = `
            SELECT p.*, u.nombre_completo AS cliente
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            WHERE p.id_pedido = ?
        `;
        const [pedidos] = await db.execute(sqlPedido, [id_pedido]);

        if (pedidos.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Pedido no encontrado.' });
        }

        const sqlDetalles = `
            SELECT dp.*, pr.nombre AS nombre_producto, pr.imagen_url
            FROM detalles_pedido dp
            JOIN productos pr ON dp.id_producto = pr.id_producto
            WHERE dp.id_pedido = ?
        `;
        const [detalles] = await db.execute(sqlDetalles, [id_pedido]);

        res.json({
            status: 'success',
            pedido: pedidos[0],
            productos: detalles
        });
    } catch (error) {
        console.error("Error al consultar el pedido específico:", error);
        res.status(500).json({ status: 'error', message: 'Error al recuperar el ticket.' });
    }
};