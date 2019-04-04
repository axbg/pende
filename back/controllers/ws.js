const fs = require("fs");
const filesPath = __dirname + "/../files";
const execute_cli = require('child_process');
const spawn = require('child_process').spawn;

module.exports.handleWS = (socket) => {
    let executable;
    let username;

    if (!socket.handshake.query.token) {
        //validate user and save its name to be used in path creation
        socket.disconnect();
        console.log("disconnect");
    } else {
        username = socket.handshake.query.token;
    }

    //run & debug
    socket.on("structure", (payload) => {
        let dirStructure = filesPath + "/" + username
            + payload.path;

        fs.exists(dirStructure, async (result) => {
            if (!result) {
                await fs.mkdir(dirStructure, { recursive: true }, () => { });
            }
            socket.emit("structured", payload);
        });
    })

    //run & debug
    socket.on("save", async (payload) => {
        try {
            let dirStructure = filesPath + "/" + username
                + payload.path;

            let path = dirStructure + "/" + payload.title;

            await fs.writeFile(path, payload.content, () => { });

            socket.emit("saved", payload);
        } catch (err) {
            console.log(err);
        }
    })

    //c-specific
    //run
    socket.on("c-run", async (payload) => {
        try {
            let filepath = filesPath + "/" + username
                + payload.path;

            let path = filesPath + "/" + username
                + payload.path + "/" + payload.title;

            execute_cli.exec("gcc " + path + " -o " + filepath + "/a.out", (result) => {
                executable = spawn("./files/" + username + payload.path + "/a.out");

                executable.on('error', function (err) {
                    socket.emit("c-error", err);
                });

                executable.stdout.on('data', function (data) {
                    socket.emit("c-output", data.toString());
                });

                executable.stderr.on('data', function (data) {
                    socket.emit("c-error", data);
                });

                executable.on('close', function (code) {
                    if (code != 0) {
                        console.log("error");
                    } else {
                        socket.emit("c-finished");
                    }
                });
            });
        } catch (error) {
            socket.emit("c-error");
        }

    })

    //run
    socket.on("c-input", payload => {
        try {
            executable.stdin.write(payload + "\n");
        } catch (err) {
            //executable.kill();
        }
    });

    socket.on("c-debug", (payload) => {
        let filepath = filesPath + "/" + username
            + "/" + (payload.path ? (payload.path) : "");

        let path = filesPath + "/" + username
            + "/" + (payload.path ? (payload.path) : "")
            + "/" + payload.name;

        execute_cli.exec("gcc -g " + path + " -o " + filepath + "/a.out", (result) => {
            executable = spawn("gdb", ['--quiet']);
            executable.stdin.write("file " + filepath + "/a.out\n");

            payload.breakpoints.forEach(bp => {
                executable.stdin.write("b " + bp + "\n");
            })

            executable.stdin.write("run\n");

            executable.stdout.on('data', function (data) {
                if (data.toString().includes("#")) {
                    socket.emit("c-debug-stack", data.toString());
                } else if (data.toString().includes("=")) {
                    socket.emit("c-debug-variables", data.toString());
                } else if (data.toString().includes("Breakpoint") && data.toString().includes("()")) {
                    socket.emit("c-debug-output", data.toString());
                    executable.stdin.write("info locals \n");
                    setTimeout(() => executable.stdin.write("backtrace \n"), 10);
                } else if (data.toString().includes("[Inferior 1")) {
                    socket.emit("c-debug-finish");
                    executable.kill();
                } else if (!data.toString().includes("gdb")) {
                    socket.emit("c-debug-output", data.toString());
                }
            });
        });
    });

    socket.on("c-debug-input", message => {
        try {
            executable.stdin.write(message + "\n");
        }
        catch (err) {
            console.log(err);
        }
    })

    socket.on("disconnect", message => {
        console.log("disconnected");
    })
}