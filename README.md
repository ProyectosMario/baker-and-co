# 🥖 Baker & Co. Enterprise - Gestión de Pastelería

Este proyecto es una aplicación Web Full-Stack para la gestión de inventario y venta de productos de pastelería artesanal.

## 🚀 Acceso al Proyecto

- **URL de Producción (Hosting):** [https://baker-and-co.onrender.com]
- **Base de Datos:** MySQL alojada en Aiven Cloud.

- **Login de prueba:** Utilizar `admin@baker.com` con contraseña `12345678`.

## 📘 Guía de Uso de la Aplicación

### 1. Módulo de Usuarios (Autenticación)

- **Registro:** Permite crear cuentas de usuario. Valida que la contraseña tenga mínimo 8 caracteres y verifica la mayoría de edad mediante el año de nacimiento.

- **Login:** Acceso seguro para usuarios registrados.


### 2. Módulo de Cliente (Tienda)

- **Catálogo:** Visualización de productos (tartas, pasteles) con precios actualizados.

- **Carrito:** Los usuarios pueden añadir productos y gestionar las cantidades antes de finalizar la compra.


### 3. Módulo de Administración (Inventario)

- **Ruta:** `/stock.html`

- **Funcionalidad:** Permite a los administradores visualizar el stock de ingredientes (harina, azúcar, etc.) y actualizar cantidades tras recibir pedidos de proveedores.
  

## 🛠️ Estructura del Backend (Código Fuente)

El backend está desarrollado en **Node.js** con **Express** siguiendo el patrón **MVC**:

- `server.js`: Punto de entrada y configuración de middlewares.

- `/routes`: Definición de todos los endpoints de la API (Auth, Productos, Ingredientes).

- `/controllers`: Lógica de negocio y consultas SQL a la base de datos.

- `/config`: Configuración de la conexión a MySQL con variables de entorno.
  

## 🌍 Regionalización e Idiomas

La aplicación utiliza un sistema de internacionalización (i18n). Para garantizar una carga inmediata y evitar bloqueos:

- El idioma por defecto es el **Español (ES)**, con opción de cambio a **Inglés (EN)** desde el menú principal.



## 📘 Guía de Uso de la Aplicación Local

**1. Requisitos Previos**

Para ejecutar este proyecto, asegúrese de tener instaladas las siguientes herramientas:

• XAMPP (o un servidor MySQL equivalente).

• Node.js (versión LTS recomendada).

• Navegador Web (Chrome, Firefox o Edge).


**2. Configuración de la Base de Datos**

1. Inicie los módulos Apache y MySQL desde el Panel de Control de XAMPP.

2. Acceda a http://localhost/phpmyadmin.

• Nota: También puede utilizar otro gestor de base de datos como MySQLWorkbench


**3. Cree una nueva base de datos llamada: baker_co_enterprise.**
 

**4. Importe el archivo SQL proporcionado (Pasteleria_BC.sql)**

   
**5. En la carpeta raíz del proyecto, encontrará un archivo llamado .env. Asegúrese de que contenga**

**las credenciales correctas para su conexión local:**
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=baker_co_enterprise
PORT=3000

**6. Instalación de Dependencias**

Abra una terminal (cmd en windows) o consola de comandos en la carpeta raíz del proyecto (por ej.

C:\proyectos\baker&co) y ejecute:


**npm install**


Esto instalará los módulos necesarios: express, mysql2, cors, dotenv y path.


**8. Puesta en Marcha**

Para iniciar el servidor, ejecute el siguiente comando en la terminal:


**node server.js**


Debería ver el mensaje: ? Baker & Co Enterprise listo en http://localhost:3000.


### 📁 Estructura del Proyecto

```text
BakerCoEnterprise/
├── config/               # Configuración conexión DB
├── controllers/          # Lógica de control (MVC)
│   ├── authController.js
│   ├── ingredientController.js
│   └── productController.js
├── middlewares/          # Funciones intermedias (seguridad)
├── node_modules/         # (Ignorado en Git) Librerías Node.js
├── public/               # Frontend (Archivos estáticos)
│   ├── css/              # Estilos CSS
│   ├── images/           # Imágenes de productos
│   ├── checkout.html
│   ├── confirmacion.html
│   ├── detalle.html
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   └── stock.html
├── routes/               # Rutas de la API
│   ├── authRoutes.js
│   ├── ingredientRoutes.js
│   └── productRoutes.js
├── .env                  # (Ignorado en Git) Variables de entorno
├── package-lock.json
├── package.json          # Dependencias y scripts
└── server.js             # Punto de entrada del servidor
