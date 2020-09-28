const fs = require("fs-extra");
const path = require("path");

const WsEvent = require("../classes/WsEvent");
const AbstractExtension = require("./AbstractExtension");
const User = require("../models").User;

const filesPath = path.join(__dirname + "/../files");

class C extends AbstractExtension {
  extend() {
    this.socket.on(WsEvent.COMMON.STRUCTURE, async (payload) => {
      const dirStructure = filesPath + "/" + this.username + payload.path;
      await fs.mkdirp(dirStructure);

      this.socket.emit(WsEvent.COMMON.STRUCTURED, payload);
    });

    this.socket.on(WsEvent.COMMON.SAVE, async (payload) => {
      const path =
        filesPath + "/" + this.username + payload.path + "/" + payload.title;

      await fs.outputFile(path, payload.content);

      this.socket.emit(WsEvent.COMMON.SAVED, payload);
    });

    this.socket.on(WsEvent.COMMON.SAVE_SETTINGS, (settings) => {
      User.findOne({ mail: this.username }).then((user) => {
        user.settings = settings;
        user.save();
      });
    });

    this.socket.on(WsEvent.COMMON.SAVE_FILES, (files) => {
      User.findOne({ mail: this.username }).then((user) => {
        user.files = files;
        user.save();
      });
    });

    this.socket.on(WsEvent.COMMON.RETRIEVE_FILE, (file) => {
      const path =
        filesPath + "/" + this.username + file.path + "/" + file.title;

      fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
        if (!err) {
          this.socket.emit(WsEvent.COMMON.RETRIEVED_FILE, {
            file: file,
            content: data,
          });
        } else {
          this.socket.emit(WsEvent.COMMON.ERROR_FILE, {
            message: "The file couldn't be open",
          });
        }
      });
    });

    this.socket.on(WsEvent.COMMON.SAVE_FILE, async (file) => {
      const path =
        filesPath + "/" + this.username + file.path + "/" + file.name;

      if (file.directory) {
        await fs.mkdirp(path);
      } else {
        await fs.outputFile(path, file.content);
      }
    });

    this.socket.on(WsEvent.COMMON.RENAME_FILE, async (file) => {
      const dirStructure = filesPath + "/" + this.username + file.path;
      await fs.move(
        dirStructure + "/" + file.oldName,
        dirStructure + "/" + file.newName
      );
    });

    this.socket.on(WsEvent.COMMON.DELETE_FILE, async (file) => {
      if (file.path !== "" && file.node !== "projects") {
        const fileLocation =
          filesPath + "/" + this.username + file.path + "/" + file.name;
        await fs.remove(fileLocation);
      }
    });
  }
}

module.exports = C;
