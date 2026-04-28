import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError, ConflictError } from '../errors';

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Необработанные ошибки (500)
  return res.status(500).json({
    message: 'Ошибка сервера',
  });
};

export default errorHandler;
