'use strict';

import User from '../user/user.model.js'; // <- ruta corregida
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Generar JWT
 */
const generateJWT = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

/**
 * Registro de usuario
 */
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Verificar si email o username ya existen
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists || usernameExists) {
      return res.status(400).json({
        success: false,
        message: `El ${emailExists ? 'email' : 'username'} ya está en uso`,
      });
    }

    // Crear usuario
    const user = new User({ name, username, email, password });

    // Hashear contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    // Generar JWT
    const token = generateJWT(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

/**
 * Login de usuario
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Usuario o contraseña incorrectos',
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'Usuario o contraseña incorrectos',
      });
    }

    // Generar JWT
    const token = generateJWT(user.id);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: { user, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};
