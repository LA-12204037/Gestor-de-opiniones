'use strict';

import { validationResult } from 'express-validator';

/**
 * Middleware para validar campos después de usar express-validator
 * Si hay errores, devuelve un JSON con todos los detalles
 */
export const validateFields = (req, res, next) => {
    
    // Obtenemos errores de validación
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Retornamos todos los errores en un JSON
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    // Si no hay errores, continua con la siguiente función
    next();
};
