'use strict';

import Post from './post.model.js';

/**
 * Crear publicación
 */
export const createPost = async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const post = new Post({
      user: req.user._id,
      title,
      category,
      content,
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Publicación creada exitosamente',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear publicación',
      error: error.message
    });
  }
};

/**
 * Editar publicación (solo autor)
 */
export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No puedes editar esta publicación'
      });
    }

    post.title = title;
    post.category = category;
    post.content = content;
    post.updatedAt = Date.now();

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Publicación actualizada exitosamente',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar publicación',
      error: error.message
    });
  }
};

/**
 * Eliminar publicación (solo autor)
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    if (!post.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar esta publicación'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Publicación eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar publicación',
      error: error.message
    });
  }
};

/**
 * Obtener todas las publicaciones (con paginación)
 */
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find()
      .populate('user', 'name username') // traer info básica del usuario
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: Number(limit),
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener publicaciones',
      error: error.message
    });
  }
};

/**
 * Obtener publicación por ID
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).populate('user', 'name username');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Publicación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener publicación',
      error: error.message
    });
  }
};
