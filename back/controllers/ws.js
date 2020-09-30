const WsEvent = require('../classes/WsEvent');
const User = require('../models').User;

const FileManager = require('../extensions/FileManager');
const C = require('../extensions/C');

const addExtensions = (socket, username, processTimeoutInterval) => {
  new FileManager(socket, username);
  new C(socket, username, processTimeoutInterval);
};

module.exports.handleWS = async (socket) => {
  const processTimeoutInterval = 5000;
  const user = await User.findOne({token: socket.handshake.query.token});

  if (!user) {
    socket.disconnect();
    return;
  }

  if (!user.files) {
    user.files = [];
  }

  addExtensions(socket, user.mail, processTimeoutInterval);

  socket.emit(WsEvent.COMMON.LOADED_INITIAL_DATA, {data: user});
  socket.on(WsEvent.COMMON.DISCONNECT, () => {});
};
