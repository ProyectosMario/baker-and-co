CREATE DATABASE IF NOT EXISTS baker_co_enterprise;
USE baker_co_enterprise;

-- 1. CATEGORÍAS (Para organizar el catálogo y URLs)
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    slug VARCHAR(60) UNIQUE NOT NULL
);

-- 2. USUARIOS 
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    identificador_acceso VARCHAR(100) UNIQUE NOT NULL, -- Email
    password_hash VARCHAR(255) NOT NULL,
    anio_nacimiento INT NOT NULL,
    rol ENUM('admin', 'empleado', 'VIP', 'estandar') DEFAULT 'estandar',
    estado ENUM('activo', 'suspendido', 'no_verificado') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. INGREDIENTES (Gestión de materias primas)
CREATE TABLE ingredientes (
    id_ingrediente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    stock_actual DECIMAL(10,2) DEFAULT 0,
    unidad_medida ENUM('kg', 'g', 'l', 'ml', 'ud') DEFAULT 'g',
    precio_referencia DECIMAL(10,2) -- Para calcular costes de producción
);

-- 4. PRODUCTOS (El catálogo final)
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre VARCHAR(100) NOT NULL,
    descripcion_corta VARCHAR(255),
    precio_base DECIMAL(12,2) NOT NULL,
    stock_disponible INT DEFAULT 0,
    imagen_url VARCHAR(255) DEFAULT 'default-cake.jpg',
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE SET NULL
);

-- 5. RECETAS 
CREATE TABLE receta_producto (
    id_producto INT,
    id_ingrediente INT,
    cantidad_necesaria DECIMAL(10,3) NOT NULL, -- Ej: 0.500 kg de harina
    PRIMARY KEY (id_producto, id_ingrediente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id_ingrediente) ON DELETE CASCADE
);

-- 6. DIRECCIONES (Logística para pedidos online)
CREATE TABLE direcciones (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    apodo VARCHAR(50), -- 'Casa', 'Trabajo'
    codigo_postal VARCHAR(10) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    localidad VARCHAR(100) NOT NULL,
    calle_numero VARCHAR(255) NOT NULL,
    instrucciones_entrega TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- 7. PEDIDOS (Cabecera de la venta)
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_direccion INT,
    referencia_pedido VARCHAR(20) UNIQUE,
    total DECIMAL(12,2) NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    estado_envio ENUM('recibido', 'en_horno', 'en_reparto', 'entregado') DEFAULT 'recibido',
    fecha_entrega_programada DATE,
    dedicatoria_personalizada VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion)
);

-- 8. DETALLE DE PEDIDOS (Líneas de factura)
CREATE TABLE pedido_items (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario_venta DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- DATOS INICIALES (Pruebas para la base de datos)
INSERT INTO categorias (nombre, slug) VALUES 
('Tartas Clásicas', 'tartas-clasicas'), 
('Pastelería Fina', 'pasteleria-fina'), 
('Especialidades', 'especialidades');

INSERT INTO productos (nombre, precio_base, id_categoria, imagen_url) VALUES 
('Tarta de Queso Artesanal', 25.00, 1, 'tarta-queso.jpg'),
('Pack 6 Cupcakes Gourmet', 18.50, 2, 'cupcakes.jpg'),
('Tarta Red Velvet', 30.00, 1, 'red-velvet.jpg');

INSERT INTO ingredientes (nombre, stock_actual, unidad_medida) VALUES 
('Harina de Trigo', 50.00, 'kg'),
('Azúcar Glass', 20.00, 'kg'),
('Mantequilla', 15.50, 'kg');

-- USUARIO DE PRUEBA (Para facilitar la corrección)
-- Email: admin@baker.com | Pass: 12345678
INSERT INTO usuarios (nombre_completo, identificador_acceso, password_hash, anio_nacimiento, rol, estado) 
VALUES (
    'Administrador de Pruebas', 
    'admin@baker.com', 
    '$2b$10$HpX36F6OaxUpKEuFyGsR6.5d4ROqZMy5xVHRiDarQ.UXeKfKDL69i', -- Hash de 12345678
    1995, 
    'admin', 
    'activo'
);


