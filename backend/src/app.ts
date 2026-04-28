import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import appLogger from './utils/appLogger';
import config from './config';
import { requestLogger, errorLogger } from './middleware/logger';
import productRoutes from './routes/product.route';
import orderRoutes from './routes/order.routes';
import { NotFoundError } from './errors';
import errorHandler from './middleware/error-handler';
import errorTransformer from './middleware/error-transformer';

const app = express();
const PORT = config.port;

const mongoURI = config.dbAddress;

async function connectToDatabase() {
  if (!mongoURI) {
    appLogger.error('DB_ADDRESS не указан в конфигурации');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    appLogger.info('Подключено к MongoDB (weblarek)');
  } catch (err) {
    appLogger.error(`Ошибка подключения к MongoDB: ${err}`);
    process.exit(1);
  }
}

connectToDatabase();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Логгер запросов (ДО роутов)
app.use(requestLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.get('/', (_req, res) => {
  res.send('Сервер работает!');
});

app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorTransformer);
// Логгер ошибок (ПОСЛЕ роутов)
app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  appLogger.info(`Сервер запущен на порту ${PORT}`);
});
