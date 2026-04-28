import winston from 'winston';
import path from 'path';

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

const logFormat = winston.format.combine(
  customTimestamp(),
  winston.format.json(),
);

// Логгер для приложения вместо console
const appLogger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs/app.log'),
      format: logFormat,
    }),
  ],
});

export default appLogger;
