const mongoose = require('mongoose');

const mongoDB = require('../config').MONGO_DB;
const host = require('../config').MONGO_HOST;

mongoose.connect('mongodb://' + host + ':27017/' + mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = mongoose.Schema({
  token: String,
  mail: String,
  files: Array,
  settings: Object,
});

const User = mongoose.model('User', UserSchema);

module.exports = {
  mongoose,
  User,
};
