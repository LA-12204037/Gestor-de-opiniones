                    'use strict';

import { Router } from 'express';
import { check } from 'express-validator';
import { createComment, editComment, deleteComment } from './comment.controller.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

// Crear comentario (autenticado)
router.post(
  '/',
  [
    validateJWT,
    check('post', 'ID de post es obligatorio').not().isEmpty(),
    check('content', 'Contenido es obligatorio').not().isEmpty(),
    validateFields
  ],
  createComment
);

// Editar comentario (solo autor)
router.put(
  '/:id',
  [
    validateJWT,
    check('content', 'Contenido es obligatorio').not().isEmpty(),
    validateFields
  ],
  editComment
);

// Eliminar comentario (solo autor)
router.delete('/:id', validateJWT, deleteComment);

export default router;
