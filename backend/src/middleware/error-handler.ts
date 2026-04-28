import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, ConflictError } from '../errors';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Ошибки celebrate оставляем как есть
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body') || err.details.get('params') || err.details.get('query');
    return res.status(400).json({
      message: errorBody?.message || 'Ошибка валидации',
    });
  }

  // Ошибка валидации Mongoose (400)
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: `Ошибка валидации: ${err.message}`,
    });
  }

  // Дубликат уникального поля (409)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      message: `Товар с таким ${field} уже существует`,
    });
  }

  // Кастомные ошибки
  if (err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({ message: err.message });
  }

  // Необработанные ошибки (500)
  return res.status(500).json({
    message: 'Ошибка сервера',
  });
};

export default errorHandler;
