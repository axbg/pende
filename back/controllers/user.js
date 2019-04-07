const mongoose = require('../models/index').mongoose
const UserModel = mongoose.model("user");
const axios = require('axios');
const uuid = require('uuid/v4');

module.exports.login = async (req, res) => {

    if (!req.body.token) {
        return res.status(400).send({ message: "Token missing" });
    }

    let googleData;
    try {
        googleData = await axios.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.body.token);
    } catch (err) {
        return res.status(500).send({ message: "Google error" });
    }

    let user = await UserModel.findOne({ mail: googleData.data.email });

    if (user) {
        return res.status(200).send({ token: user.token });
    } else {
        let token = uuid();
        user = await UserModel.create({
            mail: googleData.data.email,
            token: token,
            settings: {},
            filetree: {}
        })

        return res.status(200).send({ token: user.token });
    }
}