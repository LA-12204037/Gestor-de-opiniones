'use strict';

// -------------------------------
// Importaciones
// -------------------------------
import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

// -------------------------------
// Configurar variables de entorno
// -------------------------------
dotenv.config();

// -------------------------------
// Manejo de errores globales
// -------------------------------

// Errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// -------------------------------
// Inicializar servidor
// -------------------------------
console.log('Iniciando servidor...');
initServer();
