'use strict';

import jwt from 'jsonwebtoken';
import User from '../src/user/user.model.js'; // Asegúrate que la ruta coincida con tu proyecto

/**
 * Middleware para validar JWT
 * Protege rutas privadas y añade el usuario al request
 */
export const validateJWT = async (req, res, next) => {
    try {
        // 1️⃣ Obtener token desde el header Authorization
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token'
            });
        }

        // 2️⃣ Verificar y decodificar el token (removemos "Bearer " si existe)
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // 3️⃣ Buscar usuario en DB
        const user = await User.findById(decoded.uid);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido - usuario no existe'
            });
        }

        // 4️⃣ Adjuntar usuario al request
        req.user = user;

        next(); // continuar con la siguiente función
    } catch (error) {
        console.error('Error en validateJWT:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};
