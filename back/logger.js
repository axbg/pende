const winston = require('winston');
const {combine, timestamp, json} = winston.format;

require('winston-daily-rotate-file');

const removeErrors = winston.format((info, opts) => {
  return info.level === 'error' ? false : info;
});

const accessTransport = new winston.transports.DailyRotateFile({
  level: 'debug',
  filename: '%DATE%.log',
  dirname: 'logs/access',
  datePattern: 'YYYY-MM-DD',
  format: combine(removeErrors(), timestamp(), json()),
  utc: true,
  maxSize: '20m',
});

const errorTransport = new winston.transports.DailyRotateFile({
  level: 'warn',
  filename: '%DATE%.log',
  dirname: 'logs/error',
  datePattern: 'YYYY-MM-DD',
  format: combine(timestamp(), json()),
  utc: true,
  maxSize: '20m',
});

const winstonLogger = new winston.createLogger({
  transports: [accessTransport, errorTransport],
  exitOnError: false,
});

winstonLogger.stream = {
  write: (text) => {
    winstonLogger.debug(text);
  },
};

module.exports = winstonLogger;
