const express = require("express")
const app = express()
const PORT = 8000
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const fs = require("fs");
const filesPath = __dirname + "/files";
const execute_cli = require('child_process');
var spawn = require('child_process').spawn;

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
    socket.on("save", (payload) => {
        let dirStructure = filesPath + "/" + payload.user
            + "/" + (payload.path ? (payload.path) : "");

        if (!fs.existsSync(dirStructure)) {
            fs.mkdirSync(dirStructure, { recursive: true },
                (err) => {
                });
        }

        let path = dirStructure + "/" + payload.name;
        fs.writeFile(path, payload.content, (result) => {
            socket.emit("saved", payload);
        });
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
        await execute_cli.exec("gcc " + path + " -o" +  filepath + "/a.out");

        try{
            console.log(filepath);
        executable = spawn("." + filepath + '/a.out');
        } catch(e){
            console.log(e)
        }

        executable.on('error', function (err) {
            console.log("Error" + err);
            socket.emit("error", err);
        });

        executable.stdout.on('data', function (data) {
            socket.emit("input", data.toString());
        });

        executable.stderr.on('data', function (data) {
            console.log("in stderr.on.data : " + data);
            socket.emit("error", data);
        });

        executable.on('close', function (code) {
            if (code != 0) {
                console.log("Program ended with a error code : " + code);
                socket.emit("error", code);
            } else {
                console.log('\nended');
                socket.emit("finished");
            }
        });
    })

    //when input is received send it to the running process
    //there can be a problem: hopefully, node isolates each instance so we will
    //hold the same reference to executable as we defined it above
    socket.on("input", payload => {
        console.log(payload);
        executable.stdin.write(payload + "\n");
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