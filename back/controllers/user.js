const fs = require('fs');
const path = require('path');
const axios = require('axios');

const uuid = require('uuid/v4');

const User = require('../models').User;
const DoubleData = require('../classes/DoubleData');

const createDefaultFile = async (mail) => {
  const userSpace = path.join(__dirname + '/../files/' + mail + '/projects');

  await fs.mkdir(userSpace, {recursive: true}, () => {});
  await fs.writeFile(
      userSpace + '/welcome.c',
      '#Let\'s start hacking',
      () => {},
  );

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
        settings: {
          fontSize: new DoubleData(20, 'Font-Size', 'fontSize'),
          theme: new DoubleData('eclipse', 'Eclipse', 'theme'),
          gutter: new DoubleData(true, 'Gutter', 'gutter'),
        },
        files: [welcomeFile],
      });
    }
    return res.status(200).send({token: user.token, new: true});
  } catch (err) {
    return res.status(500).send({message: 'Google authentication error'});
  }
};
