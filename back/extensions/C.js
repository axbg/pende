const AbstractExtension = require('./AbstractExtension');
const WsEvent = require('../classes/WsEvent');
const childProcess = require('child_process');

const path = require('path');

const filesPath = path.join(__dirname + '/../files');

class C extends AbstractExtension {
  extend() {
    this.socket.on(WsEvent.C.RUN, async (payload) => {
      try {
        const filepath = filesPath + '/' + this.username + payload.path;
        const path =
          filesPath + '/' + this.username + payload.path + '/' + payload.title;

        let compiler = '';
        if (payload.title.split('.')[1] === 'c') {
          compiler = 'gcc';
        } else {
          compiler = 'g++';
        }

        childProcess.exec(
            compiler + ' ' + path + ' -fmax-errors=1 -o ' + filepath + '/a.out',
            (result) => {
              if (result != null) {
                const newResult = result.toString().split(path);
                const finalResult = [
                  newResult[newResult.length - 2],
                  newResult[newResult.length - 1].split('^')[0],
                ];
                this.socket.emit(WsEvent.C.COMPILATION_ERROR, finalResult);
                this.socket.emit(WsEvent.C.FINISHED);
                return;
              } else {
                this.socket.emit(WsEvent.NULL);
              }

              this.executable = childProcess.spawn(
                  './files/' + this.username + payload.path + '/a.out',
              );

              this.timeoutInterval = setTimeout(
                  this.forceProcessTimeout,
                  this.processTimeoutInterval,
              );

              this.executable.on('error', (err) => {
                this.socket.emit(WsEvent.C.ERROR, err);
              });

              this.executable.stdout.on('data', (data) => {
                clearTimeout(this.timeoutInterval);
                this.socket.emit(WsEvent.C.OUTPUT, data.toString());
              });

              this.executable.stderr.on('data', (data) => {
                this.socket.emit(WsEvent.C.ERROR, data);
              });

              this.executable.on('close', (code) => {
                if (!code) {
                  this.socket.emit(WsEvent.C.FINISHED);
                } else if (code != 0) {
                  console.log(code);
                  this.socket.emit(WsEvent.C.ERROR);
                }
              });
            },
        );
      } catch (error) {
        console.log(error);
        this.socket.emit(WsEvent.C.ERROR);
      }
    });

    this.socket.on(WsEvent.C.INPUT, (payload) => {
      try {
        this.executable.stdin.write(payload.command + '\n');
        this.timeoutInterval = setTimeout(
            this.forceProcessTimeout,
            this.processTimeoutInterval,
        );
      } catch (err) {
        // this.executable.kill();
      }
    });

    this.socket.on(WsEvent.C.DEBUG, (payload) => {
      const filepath = filesPath + '/' + this.username + payload.path;
      const path =
        filesPath + '/' + this.username + payload.path + '/' + payload.title;

      let compiler = '';
      if (payload.title.split('.')[1] === 'c') {
        compiler = 'gcc';
      } else {
        compiler = 'g++';
      }

      childProcess.exec(
          compiler + ' -g -fmax-errors=1 ' + path + ' -o ' + filepath + '/a.out',
          (result) => {
            this.executable = childProcess.spawn('gdb', ['-quiet']);

            if (result != null) {
              const newResult = result.toString().split(path);
              const finalResult = [
                newResult[newResult.length - 2],
                newResult[newResult.length - 1].split('^')[0],
              ];
              this.socket.emit(WsEvent.C.COMPILATION_ERROR, finalResult);
              this.socket.emit(WsEvent.C.FINISHED);
              return;
            }

            this.executable.stdin.write('file ' + filepath + '/a.out\n');

            payload.breakpoints.forEach((bp) => {
              this.executable.stdin.write('b ' + bp + '\n');
            });

            this.executable.stdin.write('run\n');

            this.timeoutInterval = setTimeout(
                () => this.forceProcessTimeout(true),
                this.processTimeoutInterval,
            );

            this.executable.stdout.on('data', (data) => {
            // protection for infinite loops that happen before any other input
            // not best practice, but couldn't find any other way for now
              if (
                (!data.toString().includes('gdb') &&
                !data.toString().includes('projects/webide/back/back') &&
                !data.toString().includes('done')) ||
              data.toString().includes('Breakpoint')
              ) {
                clearTimeout(this.timeoutInterval);
              }

              const formatted = data.toString().replace('(gdb)', '');

              if (formatted.includes('#')) {
                const stack = Object.values(
                    formatted.toString().split('\n'),
                ).filter((value, index) => {
                  if (index % 2 === 0) {
                    return value;
                  }
                });
                this.socket.emit(WsEvent.C.DEBUG_STACK, stack);
              } else if (
                formatted.includes('Breakpoint') &&
              formatted.toString().includes('(')
              ) {
                this.socket.emit(
                    WsEvent.C.DEBUG_OUTPUT,
                    formatted.split('at')[0] +
                  formatted.split(':')[1].split('\n')[1],
                );
                this.executable.stdin.write('info locals \n');
                setTimeout(() => this.executable.stdin.write('info args \n'), 10);
                setTimeout(() => this.executable.stdin.write('backtrace \n'), 10);
              } else if (data.toString().includes(' = ')) {
                this.socket.emit(
                    WsEvent.C.DEBUG_VARIABLES,
                    formatted.replace('No arguments.', ''),
                );
              } else if (data.toString().includes('[Inferior 1')) {
                this.socket.emit(WsEvent.C.DEBUG_FINISHED);
                this.executable.kill();
              } else if (data.toString().includes('Reading symbols from')) {
                //   this.socket.emit(WsEvent.C.DEBUG_OUTPUT, "\n");
              } else if (!data.toString().includes('gdb')) {
                this.socket.emit(WsEvent.C.DEBUG_OUTPUT, formatted.toString());
              }
            });
          },
      );
    });

    this.socket.on(WsEvent.C.DEBUG_INPUT, (message) => {
      try {
        this.executable.stdin.write(message.command + '\n');
        this.timeoutInterval = setTimeout(
            () => this.forceProcessTimeout(true),
            this.processTimeoutInterval,
        );
      } catch (err) {
        console.log(err);
      }
    });

    this.socket.on(WsEvent.C.STOP, (message) => {
      try {
        if (this.executable) {
          this.executable.kill();
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  forceProcessTimeout(debug) {
    try {
      this.executable.kill();
      if (debug) {
        this.socket.emit(WsEvent.C.DEBUG_FINISHED);
      } else {
        this.socket.emit(WsEvent.C.FINISHED);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = C;
