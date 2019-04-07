const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/webide", { useNewUrlParser: true });
const UserSchema = mongoose.Schema({
    token: String,
    mail: String,
    files: Array,
    settings: Object
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
    mongoose
}