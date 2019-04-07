const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/webide", { useNewUrlParser: true });


const UserSchema = mongoose.Schema({
    filetree: Object
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = {
    mongoose
}