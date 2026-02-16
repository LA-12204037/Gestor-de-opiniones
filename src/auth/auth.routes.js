'use strict';

import { Router } from 'express';
import { check } from 'express-validator';
import { register, login } from './auth.controller.js';
import { validateFields } from '../../middlewares/validate-fields.js';

const router = Router();

// Registro
router.post(
  '/register',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('username', 'El username es obligatorio').not().isEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('password', 'Contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
  ],
  register
);

// Login
router.post(
  '/login',
  [
    check('email', 'Email no válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
  ],
  login
);

export default router;
