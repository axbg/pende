const fs = require("fs");
const rimraf = require("rimraf");

const WsEvent = require("../classes/WsEvent");
const User = require("../models").User;

const filesPath = __dirname + "/../files";

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

  // coupling extensions
  new C(socket, username, processTimeoutInterval);

  socket.on(WsEvent.COMMON.STRUCTURE, (payload) => {
    const dirStructure = filesPath + "/" + username + payload.path;

    fs.exists(dirStructure, async (result) => {
      if (!result) {
        await fs.mkdir(dirStructure, { recursive: true }, () => {});
      }
      socket.emit(WsEvent.COMMON.STRUCTURED, payload);
    });
  });

  socket.on(WsEvent.COMMON.SAVE, async (payload) => {
    try {
      const dirStructure = filesPath + "/" + username + payload.path;

      const path = dirStructure + "/" + payload.title;

      await fs.writeFile(path, payload.content, () => {});

      socket.emit(WsEvent.COMMON.SAVED, payload);
    } catch (err) {}
  });

  socket.on(WsEvent.COMMON.SAVE_SETTINGS, (settings) => {
    User.findOne({ mail: username }).then((result) => {
      result.settings = settings;
      result.save();
    });
  });

  socket.on(WsEvent.COMMON.SAVE_FILES, (files) => {
    User.findOne({ mail: username }).then((result) => {
      result.files = files;
      result.save();
    });
  });

  socket.on(WsEvent.COMMON.RETRIEVE_FILE, (file) => {
    const path = filesPath + "/" + username + file.path + "/" + file.title;

    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (!err) {
        socket.emit(WsEvent.COMMON.RETRIEVED_FILE, {
          file: file,
          content: data,
        });
      } else {
        // handle this error. display something in front-end
        console.log(err);
      }
    });
  });

  socket.on(WsEvent.COMMON.SAVE_FILE, (file) => {
    const dirStructure = filesPath + "/" + username + file.path;

    fs.exists(dirStructure, async (result) => {
      const path = dirStructure + "/" + file.name;

      if (!result) {
        await fs.mkdir(dirStructure, { recursive: true }, () => {});
        setTimeout(async () => {
          if (file.directory) {
            await fs.mkdir(path, () => {});
          } else {
            await fs.writeFile(path, file.content, () => {});
          }
        }, 100);
      } else {
        if (file.directory) {
          await fs.mkdir(path, () => {});
        } else {
          await fs.writeFile(path, file.content, () => {});
        }
      }
    });
  });

  socket.on(WsEvent.COMMON.RENAME_FILE, (file) => {
    const dirStructure = filesPath + "/" + username + file.path;
    fs.rename(
      dirStructure + "/" + file.oldName,
      dirStructure + "/" + file.newName,
      function (err) {}
    );
  });

  socket.on(WsEvent.COMMON.DELETE_FILE, (file) => {
    if (file.path !== "" && file.node !== "projects") {
      const fileLocation =
        filesPath + "/" + username + file.path + "/" + file.name;
      rimraf(fileLocation, fs, () => {});
    }
  });

  socket.on(WsEvent.COMMON.DISCONNECT, (message) => {});
};
