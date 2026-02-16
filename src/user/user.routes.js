'use strict';

import { Router } from 'express';
import { check } from 'express-validator';
import { getProfile, updateProfile, changePassword } from './user.controller.js';
import { validateFields } from '../../middlewares/validate-fields.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';

const router = Router();

// Obtener perfil
router.get('/me', validateJWT, getProfile);

// Actualizar perfil
router.put(
  '/me',
  [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('username', 'El username es obligatorio').not().isEmpty(),
    validateFields
  ],
  updateProfile
);

// Cambiar contraseña
router.put(
  '/me/password',
  [
    validateJWT,
    check('currentPassword', 'Contraseña actual es obligatoria').not().isEmpty(),
    check('newPassword', 'Nueva contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
  ],
  changePassword
);

export default router;
