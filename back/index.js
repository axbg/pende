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
    res.sendFile(__dirname + "/index.html");
});

app.get("/secondary", (req, res) => {
    res.sendFile(__dirname + "/index2.html");
})

io.on("connection", (socket) => {
    let executable;
    //create directory structure if doesn't exist
    //create physical file in the specified directory
    socket.on("structure", (payload) => {
        let dirStructure = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        fs.exists(dirStructure, async (result) => {
            if(!result){
                await fs.mkdir(dirStructure, {recursive: true}, () => {});
            }
            socket.emit("structured", payload);
        });

    })

    socket.on("save", async (payload) => {
        let dirStructure = filesPath + "/" + payload.user
        + "/" + (payload.path ? (payload.path) : "");

        let path = dirStructure + "/" + payload.name;
        await fs.writeFile(path, payload.content, () => {});
        
        socket.emit("saved", payload);
    })

    //compiles the c source code to a.out executable
    //runs the program
    //attaches event handlers
    socket.on("run", async (payload) => {
        let filepath = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        let path = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "")
            + "/" + payload.name;

        execute_cli.exec("gcc " + path + " -o " + filepath + "/a.out", (result) => {
        executable = spawn("./files/" + payload.user + "/" + payload.path + "/a.out");

        executable.on('error', function (err) {
            console.log("Error" + err);
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

    //when input is received send it to the running process
    //there can be a problem: hopefully, node isolates each instance so we will
    //hold the same reference to executable as we defined it above
    socket.on("input", payload => {
        try{
            executable.stdin.write(payload + "\n");
        } catch(err){
            executable.kill();
        }
    });


    /*
    //compiles the source code
    //starts gdb 
    //attaches handlers
    socket.on("debug", (payload) => {
        console.log("debugging program");
    });

    socket.on("continue", (payload) => {
        console.log("continue");
    })
    */

    socket.on("close", (payload) => {
        console.log("closing program");
    })

})

server.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})