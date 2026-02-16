'use strict';

import mongoose from 'mongoose';

// Función para conectar a MongoDB
export const dbConnection = async () => {
  // Verificar que la variable de entorno exista
  if (!process.env.URI_MONGODB) {
    console.error('❌ Error: la variable de entorno URI_MONGODB no está definida en .env');
    process.exit(1);
  }

  try {
    // ================= MONITOREO =================
    mongoose.connection.on('error', () => {
      console.error('MongoDB | Error de conexión');
      mongoose.disconnect();
    });

    mongoose.connection.on('connecting', () => {
      console.log('MongoDB | Intentando conectar...');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB | Conectado correctamente');
    });

    mongoose.connection.on('open', () => {
      console.log('MongoDB | Base de datos conectada: GESTOR-OPINIONES');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB | Reconectado a MongoDB');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB | Desconectado de MongoDB');
    });

    // ================= CONEXIÓN =================
    await mongoose.connect(process.env.URI_MONGODB, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

  } catch (error) {
    console.error(`Error al conectar la base de datos: ${error}`);
    process.exit(1);
  }
};

// ================= CIERRE CONTROLADO =================
const gracefulShutdown = async (signal) => {
  console.log(`MongoDB | Señal recibida: ${signal}. Cerrando conexión...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB | Conexión cerrada correctamente');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB | Error durante el cierre:', error.message);
    process.exit(1);
  }
};

// ================= MANEJO DE SEÑALES =================
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // Para reinicio con nodemon
