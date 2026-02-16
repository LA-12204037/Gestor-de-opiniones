'use strict';

// -------------------------------
// Importaciones
// -------------------------------
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { dbConnection } from './db.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import { corsOptions } from './cors-configuration.js';

// Rutas
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/user/user.routes.js';
import postRoutes from '../src/post/post.routes.js';
import commentRoutes from '../src/comment/comment.routes.js';

// -------------------------------
// Constantes
// -------------------------------
const BASE_URL = '/api/v1';
const PORT = process.env.PORT || 3001;

// -------------------------------
// Middlewares
// -------------------------------
const middlewares = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(morgan('dev'));
  app.use(helmet());

  // Rate limit: 100 requests por 15 minutos
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      message: 'Demasiadas solicitudes, intenta más tarde'
    }
  });
  app.use(limiter);
};

// -------------------------------
// Rutas
// -------------------------------
const routes = (app) => {
  app.use(`${BASE_URL}/auth`, authRoutes);
  app.use(`${BASE_URL}/users`, userRoutes);
  app.use(`${BASE_URL}/posts`, postRoutes);
  app.use(`${BASE_URL}/comments`, commentRoutes);

  // Health check
  app.get(`${BASE_URL}/health`, (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'Gestor de Opiniones',
      version: '1.0.0'
    });
  });
};

// -------------------------------
// Inicializar servidor
// -------------------------------
const initServer = async () => {
  try {
    const app = express();

    // Conectar a DB
    await dbConnection();

    // Middlewares y rutas
    middlewares(app);
    routes(app);

    // Middleware de errores global
    app.use(errorHandler);

    // Levantar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}${BASE_URL}`);
    });

  } catch (error) {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// -------------------------------
// Exportar función
// -------------------------------
export { initServer };
