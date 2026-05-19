const db = require('../config/db');
const bcrypt = require('bcrypt');

// REGISTRO DE USUARIOS
exports.registerUser = async (req, res) => {
    try {
        const {nombre_completo, email, password, anio_nacimiento} = req.body;

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);

        const sql = `INSERT INTO usuarios (nombre_completo, identificador_acceso, password_hash, anio_nacimiento, rol) 
                     VALUES (?, ?, ?, ?, 'estandar')`;

        await db.execute(sql, [nombre_completo, email, hashedPwd, anio_nacimiento]);

        res.status(201).json({
            status: 'success',
            message: '¡Cuenta creada con éxito en Baker & Co.!'
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({status: 'error', message: 'El correo ya está registrado.'});
        }
        res.status(500).json({status: 'error', message: 'Error interno al registrar.'});
    }
};

// LOGIN DE USUARIOS CON ROL INCLUIDO
exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        // 1. Buscar al usuario por su email
        const [users] = await db.execute('SELECT * FROM usuarios WHERE identificador_acceso = ?', [email]);

        if (users.length === 0) {
            return res.status(401).json({status: 'error', message: 'Usuario o contraseña incorrecto.'});
        }

        const user = users[0];

        // 2. Comparar la contraseña con el hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({status: 'error', message: 'Usuario o contraseña incorrecto.'});
        }

        // 3. Login exitoso enviando el rol real de la BBDD
        res.json({
            status: 'success',
            message: `Bienvenido, ${user.nombre_completo}`,
            user: {
                id: user.id_usuario,
                nombre: user.nombre_completo,
                email: user.identificador_acceso,
                rol: user.rol 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({status: 'error', message: 'Error interno en el inicio de sesión.'});
    }
};
