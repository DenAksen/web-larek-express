import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import appLogger from '../utils/appLogger';
import { NotFoundError } from '../errors';

// GET /product — получить все товары
export const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();

    // Форматируем ответ
    const response = {
      items: products,
      total: products.length,
    };

    appLogger.info(`GET /product - возвращено ${products.length} товаров`);
    return res.status(200).json(response);
  } catch (error) {
    appLogger.error(`Ошибка при получении товаров: ${error}`);
    return next(error);
  }
};

// GET /product/:id — получить товар по ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return next(new NotFoundError('Товар не найден'));
    }

    appLogger.info(`GET /product/${id} - товар найден`);
    return res.status(200).json(product);
  } catch (error) {
    appLogger.error(`Ошибка при получении товара: ${error}`);
    return next(error);
  }
};

// POST /product — создать новый товар
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      image,
      category,
      description,
      price,
    } = req.body;

    // Создание товара
    const newProduct = new Product({
      title,
      image,
      category,
      description: description || '',
      price: price !== undefined ? price : null,
    });

    await newProduct.save();
    appLogger.info(`POST /product - создан товар: ${title}`);
    return res.status(201).json(newProduct);
  } catch (error) {
    appLogger.error(`Ошибка при создании товара: ${error}`);
    return next(error);
  }
};
