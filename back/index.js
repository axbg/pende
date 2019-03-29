const express = require("express")
const app = express()
const PORT = 8000
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");
const filesPath = __dirname + "/files";
const execute_cli = require('child_process');
const spawn = require('child_process').spawn;

app.get("/", (req, res) => {
    res.send({ "message": "welcome to back" })
})

app.get("/main", (req, res) => {
    res.sendFile(__dirname + "/run.html");
});

app.get("/debug", (req, res) => {
    res.sendFile(__dirname + "/debug.html");
})

io.on("connection", (socket) => {
    let executable;

    //run & debug
    socket.on("structure", (payload) => {
        let dirStructure = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        fs.exists(dirStructure, async (result) => {
            if (!result) {
                await fs.mkdir(dirStructure, { recursive: true }, () => { });
            }
            socket.emit("structured", payload);
        });

    })

    //run & debug
    socket.on("save", async (payload) => {
        let dirStructure = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        let path = dirStructure + "/" + payload.name;
        await fs.writeFile(path, payload.content, () => { });

        socket.emit("saved", payload);
    })

    //run
    socket.on("run", async (payload) => {
        let filepath = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        let path = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "")
            + "/" + payload.name;

        execute_cli.exec("gcc " + path + " -o " + filepath + "/a.out", (result) => {
            executable = spawn("./files/" + payload.user + "/" + payload.path + "/a.out");

            executable.on('error', function (err) {
                socket.emit("error", err);
            });

            executable.stdout.on('data', function (data) {
                socket.emit("output", data.toString());
            });

            executable.stderr.on('data', function (data) {
                socket.emit("error", data);
            });

            executable.on('close', function (code) {
                if (code != 0) {
                    socket.emit("error", code);
                } else {
                    socket.emit("finished");
                }
            });
        })
    })

    //run
    socket.on("input", payload => {
        try {
            executable.stdin.write(payload + "\n");
        } catch (err) {
            executable.kill();
        }
    });

    socket.on("debug", (payload) => {
        let filepath = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        let path = filesPath + "/" + payload.user
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
                    socket.emit("debug-stack", data.toString());
                } else if (data.toString().includes("=")) {
                    socket.emit("debug-variables", data.toString());
                } else if (data.toString().includes("Breakpoint") && data.toString().includes("()")) {
                    socket.emit("debug-output", data.toString());
                    executable.stdin.write("info locals \n");
                    setTimeout(() => executable.stdin.write("backtrace \n"), 10);
                } else if (data.toString().includes("[Inferior 1")) {
                    socket.emit("debug-finish");
                    executable.kill();
                } else if (!data.toString().includes("gdb")) {
                    socket.emit("debug-output", data.toString());
                }
            });
        });
    });

    socket.on("debug-input", message => {
        executable.stdin.write(message + "\n");
    })

    socket.on("close", (payload) => {
        console.log("closing program");
    })

})

server.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})