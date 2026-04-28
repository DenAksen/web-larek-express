import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

// Московское время
const customTimestamp = winston.format((info) => {
  const now = new Date();
  const localTimestamp = now.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return {
    ...info,
    timestamp: localTimestamp,
  };
});

// Настройка формата логов
const logFormat = winston.format.combine(
  customTimestamp(),
  winston.format.json(),
);

// Логгер для запросов
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/request.log'),
      format: logFormat,
    }),
  ],
  format: logFormat,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
});

// Логгер для ошибок
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      format: logFormat,
    }),
  ],
  format: logFormat,
});
