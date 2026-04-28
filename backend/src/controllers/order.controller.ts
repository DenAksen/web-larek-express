import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product, { IProduct } from '../models/product.model';
import appLogger from '../utils/appLogger';
import { BadRequestError, NotFoundError } from '../errors';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      payment,
      _email,
      _phone,
      _address,
      total,
      items,
    } = req.body;

    // Проверяем, что все товары существуют в базе
    const products = await Product.find({
      _id: { $in: items },
    });

    if (products.length !== items.length) {
      return next(new NotFoundError('Один или несколько товаров не найдены'));
    }

    // Проверяем, что все товары продаются (price не null)
    const invalidProducts = products.filter(
      (p:IProduct) => p.price === null || p.price === undefined,
    );
    if (invalidProducts.length > 0) {
      return next(new BadRequestError('Некоторые товары недоступны для продажи'));
    }

    // Вычисляем реальную сумму товаров
    const calculatedTotal = products.reduce(
      (sum: number, product: IProduct) => sum + (product.price || 0),
      0,
    );

    // Сравниваем с переданной суммой
    if (Math.abs(calculatedTotal - total) > 0) {
      return next(new BadRequestError('Общая сумма заказа не соответствует стоимости товаров'));
    }

    // Генерируем ID заказа
    const orderId = faker.string.uuid();

    // Логируем создание заказа
    appLogger.info(`Order created: ${orderId}, total: ${total}, payment: ${payment}`);

    // 7. Возвращаем ответ
    return res.status(201).json({
      id: orderId,
      total,
    });
  } catch (error) {
    appLogger.error(`Создание заказа: ${error}`);
    return next(error);
  }
};

export default createOrder;
