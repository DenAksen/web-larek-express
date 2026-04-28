import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';

const errorTransformer = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body') || err.details.get('params') || err.details.get('query');
    next(new BadRequestError(errorBody?.message || 'Ошибка валидации'));
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    next(new NotFoundError(`Ошибка валидации: ${err.message}`));
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    next(new ConflictError(`Товар с таким ${field} уже существует`));
    return;
  }

  next(err);
};

export default errorTransformer;
