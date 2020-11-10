const dotenv = require('dotenv');
dotenv.config();

const PROD = !!+process.env.PROD
const PORT = process.env.PROD ? 8080 : process.env.PORT || 8080;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB = process.env.MONGO_DB || 'pende';

module.exports = {
  PROD,
  PORT,
  MONGO_HOST,
  MONGO_DB
};
