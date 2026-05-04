const validateRegistration = (req, res, next) => {
    const { email, password, nombre_completo, anio_nacimiento } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const currentYear = new Date().getFullYear();
    
    // Validación del nombre
    if (!nombre_completo || nombre_completo.length < 3) {
        return res.status(400).json({ status: 'error', message: 'Nombre demasiado corto.' });
    }
    // Validación del email
    if (!emailRegex.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Formato de email inválido.' });
    }
    // Validación del año nacimiento 
    if (!anio_nacimiento || anio_nacimiento < 1920 || anio_nacimiento > currentYear) {
        return res.status(400).json({ status: 'error', message: `Año de nacimiento no válido (1920-${currentYear}).` });
    }
    // Validación del password
    if (!password || password.length < 8) {
        return res.status(400).json({ status: 'error', message: 'La contraseña debe tener al menos 8 caracteres.' });
    }
    next();
};

module.exports = { validateRegistration };