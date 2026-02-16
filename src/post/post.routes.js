'use strict';

import { Router } from 'express';
import { check } from 'express-validator';
import { createPost, editPost, deletePost, getPosts, getPostById } from './post.controller.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

// Crear publicación
router.post(
  '/',
  [
    validateJWT,
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validateFields
  ],
  createPost
);

// Editar publicación
router.put(
  '/:id',
  [
    validateJWT,
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('category', 'La categoría es obligatoria').not().isEmpty(),
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validateFields
  ],
  editPost
);

// Eliminar publicación
router.delete('/:id', validateJWT, deletePost);

// Obtener todas las publicaciones
router.get('/', getPosts);

// Obtener publicación por ID
router.get('/:id', getPostById);

export default router;
