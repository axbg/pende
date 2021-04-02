const dotenv = require('dotenv');
dotenv.config();

const CLIENT_ID_PLACEHOLDER = "#GOOGLE_CLIENT_ID#";

const PROD = !!+process.env.PROD
const PORT = process.env.PROD ? 8080 : process.env.PORT || 8080;
const MONGO_HOST = process.env.MONGO_HOST || PROD ? 'host.docker.internal' : 'localhost';
const MONGO_DB = process.env.MONGO_DB || 'pende';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

module.exports = {
  PROD,
  PORT,
  MONGO_HOST,
  MONGO_DB,
  GOOGLE_CLIENT_ID,
  CLIENT_ID_PLACEHOLDER
};
