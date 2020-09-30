const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;
const MONGO_DB = process.env.MONGO_DB || 'pende';

module.exports = {
  PORT,
  MONGO_DB,
};
