const WsEvent = require("../classes/WsEvent");
const User = require("../models").User;

const FileManager = require('../extensions/FileManager');
const C = require("../extensions/C");

module.exports.handleWS = async (socket) => {
  let username;
  const processTimeoutInterval = 5000;

  const user = await User.findOne({ token: socket.handshake.query.token });

  if (user) {
    if (!user.files) {
      user.files = [];
    }

    username = user.mail;
    socket.emit(WsEvent.COMMON.LOADED_INITIAL_DATA, { data: user });
  } else {
    socket.disconnect();
  }

  new FileManager(socket, username);
  new C(socket, username, processTimeoutInterval);

  socket.on(WsEvent.COMMON.DISCONNECT, () => {});
};
