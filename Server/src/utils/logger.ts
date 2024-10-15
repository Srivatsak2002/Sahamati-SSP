import winston from 'winston';

const logger = ((config: winston.LoggerOptions = {}) => {
  const instance = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console({ format: winston.format.simple() })],
    ...config,
  });

  return instance;
})();

export default logger;
