'use strict';

import Comment from './comment.model.js';

/**
 * Crear comentario
 */
export const createComment = async (req, res) => {
  try {
    const { post, content } = req.body;

    const comment = new Comment({
      user: req.user._id,
      post,
      content
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear comentario',
      error: error.message
    });
  }
};

/**
 * Editar comentario (solo autor)
 */
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    if (!comment.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No puedes editar este comentario'
      });
    }

    comment.content = content;
    comment.updatedAt = Date.now();

    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar comentario',
      error: error.message
    });
  }
};

/**
 * Eliminar comentario (solo autor)
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado'
      });
    }

    if (!comment.user.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar este comentario'
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar comentario',
      error: error.message
    });
  }
};
