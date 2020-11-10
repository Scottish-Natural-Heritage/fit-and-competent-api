import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'fit-and-competent-api'},
  transports: [new winston.transports.Console({colorize: true})]
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  }
};

export {logger as default};
