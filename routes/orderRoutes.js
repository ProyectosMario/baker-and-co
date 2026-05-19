const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. CLIENTE: Registrar compra asíncrona
router.post('/crear', orderController.createOrder);

// 2. CLIENTE: Ver su historial personal
router.get('/usuario/:id_usuario', orderController.getOrdersByUser);

// 3. CLIENTE: Obtener los datos del ticket por ID de pedido
router.get('/:id_pedido', orderController.getOrderById);

// 4. EMPLEADO: Listado global para empleados y administradores
router.get('/', orderController.getAllOrders);

// 5. EMPLEADO: Cambiar el estado del pastel/producto en producción
router.put('/actualizar-estado', orderController.updateOrderStatus);

// 6. EMPLEADO: Asignar un pastelero al pedido
router.put('/asignar-empleado', orderController.assignEmployee);

module.exports = router;