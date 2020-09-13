const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');

const AbstractExtension = require('./AbstractExtension');
const WsEvent = require('../classes/WsEvent');

const User = require('../models').User;

const filesPath = path.join(__dirname + '/../files');

class C extends AbstractExtension {
  extend() {
    this.socket.on(WsEvent.COMMON.STRUCTURE, (payload) => {
      const dirStructure = filesPath + '/' + this.username + payload.path;

      fs.exists(dirStructure, async (result) => {
        if (!result) {
          await fs.mkdir(dirStructure, {recursive: true}, () => {});
        }
        this.socket.emit(WsEvent.COMMON.STRUCTURED, payload);
      });
    });

    this.socket.on(WsEvent.COMMON.SAVE, async (payload) => {
      try {
        const dirStructure = filesPath + '/' + this.username + payload.path;

        const path = dirStructure + '/' + payload.title;

        await fs.writeFile(path, payload.content, () => {});

        this.socket.emit(WsEvent.COMMON.SAVED, payload);
      } catch (err) {}
    });

    this.socket.on(WsEvent.COMMON.SAVE_SETTINGS, (settings) => {
      User.findOne({mail: this.username}).then((result) => {
        result.settings = settings;
        result.save();
      });
    });

    this.socket.on(WsEvent.COMMON.SAVE_FILES, (files) => {
      User.findOne({mail: this.username}).then((result) => {
        result.files = files;
        result.save();
      });
    });

    this.socket.on(WsEvent.COMMON.RETRIEVE_FILE, (file) => {
      const path = filesPath + '/' + this.username + file.path + '/' + file.title;

      fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
        if (!err) {
          this.socket.emit(WsEvent.COMMON.RETRIEVED_FILE, {
            file: file,
            content: data,
          });
        } else {
          // handle this error. display something in front-end
          console.log(err);
        }
      });
    });

    this.socket.on(WsEvent.COMMON.SAVE_FILE, (file) => {
      const dirStructure = filesPath + '/' + this.username + file.path;

      fs.exists(dirStructure, async (result) => {
        const path = dirStructure + '/' + file.name;

        if (!result) {
          await fs.mkdir(dirStructure, {recursive: true}, () => {});
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

    this.socket.on(WsEvent.COMMON.RENAME_FILE, (file) => {
      const dirStructure = filesPath + '/' + this.username + file.path;
      fs.rename(
          dirStructure + '/' + file.oldName,
          dirStructure + '/' + file.newName,
          function(err) {},
      );
    });

    this.socket.on(WsEvent.COMMON.DELETE_FILE, (file) => {
      if (file.path !== '' && file.node !== 'projects') {
        const fileLocation =
          filesPath + '/' + this.username + file.path + '/' + file.name;
        rimraf(fileLocation, fs, () => {});
      }
    });
  }
}

module.exports = C;
