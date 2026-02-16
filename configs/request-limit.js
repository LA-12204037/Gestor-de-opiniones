'use strict';

// Importamos la librería de limitación de peticiones
import rateLimit from 'express-rate-limit';

/**
 * apiLimiter
 * Limita la cantidad de peticiones que una IP puede hacer en un tiempo determinado.
 * Esto ayuda a prevenir ataques de fuerza bruta, especialmente en login.
 */
export const apiLimiter = rateLimit({

    // Ventana de tiempo: 15 minutos
    windowMs: 15 * 60 * 1000, 

    // Número máximo de peticiones permitidas por ventana
    max: 100, 

    // Devuelve info de límites en headers modernos
    standardHeaders: true,  

    // Desactiva headers antiguos (Legacy)
    legacyHeaders: false,  

    // Mensaje de respuesta cuando se excede el límite
    message: {
        ok: false,
        message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.'
    },

    // Función opcional de callback para logging
    onLimitReached: (req, res, options) => {
        console.warn(`API Limit alcanzado para IP: ${req.ip} en ${new Date().toISOString()}`);
    }

});
