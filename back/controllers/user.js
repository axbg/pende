const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const uuid = require('uuid/v4');

const User = require('../models').User;
const SettingData = require('../classes/SettingData');

const createDefaultFile = async (mail) => {
  const userSpace = path.join(
      __dirname + '/../files/' + mail + '/projects/welcome.c',
  );

  await fs.outputFile(userSpace, '#Let\'s start hacking');

  return {path: '/projects', value: 'welcome.c', id: uuid()};
};

module.exports.login = async (req, res) => {
  try {
    if (!req.body.token) {
      return res.status(400).send({message: 'Token missing'});
    }

    const googleData = await axios.get(
        'https://oauth2.googleapis.com/tokeninfo?id_token=' + req.body.token,
    );

    let user = await User.findOne({mail: googleData.data.email});

    if (!user) {
      const welcomeFile = await createDefaultFile(googleData.data.email);
      user = await User.create({
        mail: googleData.data.email,
        token: uuid(),
        SettingDatas: {
          fontSize: new SettingData(20, 'Font-Size', 'fontSize'),
          theme: new SettingData('eclipse', 'Eclipse', 'theme'),
          gutter: new SettingData(true, 'Gutter', 'gutter'),
        },
        files: [welcomeFile],
      });
    }
    return res.status(200).send({token: user.token, new: true});
  } catch (err) {
    return res.status(500).send({message: 'Authentication error'});
  }
};
