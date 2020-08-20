const fs = require('fs');
const rimraf = require('rimraf');
const childProcess = require('child_process');

const WsEvent = require('../classes/WsEvent');
const User = require('../models').User;

const filesPath = __dirname + '/../files';

const forceProcessTimeout = (debug) => {
  try {
    executable.kill();
    if (debug) {
      socket.emit(WsEvent.C.DEBUG_FINISHED);
    } else {
      socket.emit(WsEvent.C.FINISHED);
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports.handleWS = async (socket) => {
  let executable; let username; let timeoutInterval; const processTimeoutInterval = 5000;

  const user = await User.findOne({token: socket.handshake.query.token});

  if (user) {
    if (!user.files) {
      user.files = [];
    }

    username = user.mail;
    socket.emit(WsEvent.COMMON.LOADED_INITIAL_DATA, {data: user});
  } else {
    socket.disconnect();
  }

  // run & debug
  socket.on(WsEvent.COMMON.STRUCTURE, (payload) => {
    const dirStructure = filesPath + '/' + username + payload.path;

    fs.exists(dirStructure, async (result) => {
      if (!result) {
        await fs.mkdir(dirStructure, {recursive: true}, () => { });
      }
      socket.emit(WsEvent.COMMON.STRUCTURED, payload);
    });
  });

  // run & debug
  socket.on(WsEvent.COMMON.SAVE, async (payload) => {
    try {
      const dirStructure = filesPath + '/' + username + payload.path;

      const path = dirStructure + '/' + payload.title;

      await fs.writeFile(path, payload.content, () => { });

      socket.emit(WsEvent.COMMON.SAVED, payload);
    } catch (err) {}
  });

  // c-specific
  // run
  socket.on(WsEvent.C.RUN, async (payload) => {
    try {
      const filepath = filesPath + '/' + username + payload.path;
      const path = filesPath + '/' + username + payload.path + '/' + payload.title;

      let compiler = '';
      if (payload.title.split('.')[1] === 'c') {
        compiler = 'gcc';
      } else {
        compiler = 'g++';
      }

      childProcess.exec(compiler + ' ' + path + ' -fmax-errors=1 -o ' + filepath + '/a.out', (result) => {
        if (result != null) {
          const newResult = result.toString().split(path);
          const finalResult = [newResult[newResult.length - 2], newResult[newResult.length - 1].split('^')[0]];
          socket.emit(WsEvent.C.COMPILATION_ERROR, finalResult);
          socket.emit(WsEvent.C.FINISHED);
          return;
        } else {
          socket.emit(WsEvent.NULL);
        }

        executable = childProcess.spawn('./files/' + username + payload.path + '/a.out');

        timeoutInterval = setTimeout(forceProcessTimeout, processTimeoutInterval);

        executable.on('error', function(err) {
          socket.emit(WsEvent.C.ERROR, err);
        });

        executable.stdout.on('data', function(data) {
          clearTimeout(timeoutInterval);
          socket.emit(WsEvent.C.OUTPUT, data.toString());
        });

        executable.stderr.on('data', function(data) {
          socket.emit(WsEvent.C.ERROR, data);
        });

        executable.on('close', function(code) {
          if (!code) {
            socket.emit(WsEvent.C.FINISHED);
          } else if (code != 0) {
            console.log(code);
            socket.emit(WsEvent.C.ERROR);
          }
        });
      });
    } catch (error) {
      console.log(error);
      socket.emit(WsEvent.C.ERROR);
    }
  });

  // run
  socket.on(WsEvent.C.INPUT, (payload) => {
    try {
      executable.stdin.write(payload.command + '\n');
      timeoutInterval = setTimeout(forceProcessTimeout, processTimeoutInterval);
    } catch (err) {
      // executable.kill();
    }
  });

  // debug
  socket.on(WsEvent.C.DEBUG, (payload) => {
    const filepath = filesPath + '/' + username + payload.path;
    const path = filesPath + '/' + username + payload.path + '/' + payload.title;

    let compiler = '';
    if (payload.title.split('.')[1] === 'c') {
      compiler = 'gcc';
    } else {
      compiler = 'g++';
    }

    childProcess.exec(compiler + ' -g -fmax-errors=1 ' + path + ' -o ' + filepath + '/a.out', (result) => {
      executable = childProcess.spawn('gdb', ['-quiet']);

      if (result != null) {
        const newResult = result.toString().split(path);
        const finalResult = [newResult[newResult.length - 2], newResult[newResult.length - 1].split('^')[0]];
        socket.emit(WsEvent.C.COMPILATION_ERROR, finalResult);
        socket.emit(WsEvent.C.FINISHED);
        return;
      }

      executable.stdin.write('file ' + filepath + '/a.out\n');

      payload.breakpoints.forEach((bp) => {
        executable.stdin.write('b ' + bp + '\n');
      });

      executable.stdin.write('run\n');

      timeoutInterval = setTimeout(() => forceProcessTimeout(true), processTimeoutInterval);

      executable.stdout.on('data', function(data) {
        // protection for infinite loops that happen before any other input
        // not best practice, but couldn't find any other way for now
        if ((!data.toString().includes('gdb') && !data.toString().includes('projects/webide/back/back') &&
                    !data.toString().includes('done')) || data.toString().includes('Breakpoint')) {
          clearTimeout(timeoutInterval);
        }

        const formatted = data.toString().replace('(gdb)', '');

        if (formatted.includes('#')) {
          const stack = Object.values(formatted.toString().split('\n')).filter((value, index) => {
            if (index % 2 === 0) {
              return value;
            }
          });
          socket.emit(WsEvent.C.DEBUG_STACK, stack);
        } else if (data.toString().includes(' = ')) {
          socket.emit(WsEvent.C.DEBUG_VARIABLES, formatted.replace('No arguments.', ''));
        } else if (formatted.includes('Breakpoint') && formatted.toString().includes('(')) {
          socket.emit(WsEvent.C.DEBUG_OUTPUT, formatted.toString());
          executable.stdin.write('info locals \n');
          setTimeout(() => executable.stdin.write('info args \n'), 10);
          setTimeout(() => executable.stdin.write('backtrace \n'), 10);
        } else if (data.toString().includes('[Inferior 1')) {
          socket.emit(WsEvent.C.DEBUG_FINISHED);
          executable.kill();
        } else if (!data.toString().includes('gdb')) {
          socket.emit(WsEvent.C.DEBUG_OUTPUT, formatted.toString());
        }
      });
    });
  });

  socket.on(WsEvent.C.DEBUG_INPUT, (message) => {
    try {
      executable.stdin.write(message.command + '\n');
      timeoutInterval = setTimeout(() => forceProcessTimeout(true), processTimeoutInterval);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on(WsEvent.C.STOP, (message) => {
    try {
      if (executable) {
        executable.kill();
      }
    } catch (err) {
      console.log(err);
    }
  });

  // user settings & files management
  socket.on(WsEvent.COMMON.SAVE_SETTINGS, (settings) => {
    User.findOne({mail: username})
        .then((result) => {
          result.settings = settings;
          result.save();
        });
  });

  socket.on(WsEvent.COMMON.SAVE_FILES, (files) => {
    User.findOne({mail: username})
        .then((result) => {
          result.files = files;
          result.save();
        });
  });

  socket.on(WsEvent.COMMON.RETRIEVE_FILE, (file) => {
    const path = filesPath + '/' + username + file.path + '/' + file.title;

    fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
      if (!err) {
        socket.emit(WsEvent.COMMON.RETRIEVED_FILE, {file: file, content: data});
      } else {
        // handle this error. display something in front-end
        console.log(err);
      }
    });
  });

  socket.on(WsEvent.COMMON.SAVE_FILE, (file) => {
    const dirStructure = filesPath + '/' + username + file.path;

    fs.exists(dirStructure, async (result) => {
      const path = dirStructure + '/' + file.name;

      if (!result) {
        await fs.mkdir(dirStructure, {recursive: true}, () => { });
        setTimeout(async () => {
          if (file.directory) {
            await fs.mkdir(path, () => { });
          } else {
            await fs.writeFile(path, file.content, () => { });
          }
        }, 100);
      } else {
        if (file.directory) {
          await fs.mkdir(path, () => { });
        } else {
          await fs.writeFile(path, file.content, () => { });
        }
      }
    });
  });

  socket.on(WsEvent.COMMON.RENAME_FILE, (file) => {
    const dirStructure = filesPath + '/' + username + file.path;
    fs.rename(dirStructure + '/' + file.oldName, dirStructure + '/' + file.newName, function(err) {});
  });

  socket.on(WsEvent.COMMON.DELETE_FILE, (file) => {
    if (file.path !== '' && file.node !== 'projects') {
      const fileLocation = filesPath + '/' + username + file.path + '/' + file.name;
      rimraf(fileLocation, fs, () => {});
    }
  });

  socket.on(WsEvent.COMMON.DISCONNECT, (message) => {
    executable.kill();
  });
};
