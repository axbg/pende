const express = require("express")
const app = express()
const PORT = 8000
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wsController = require('./controllers/ws').handleWS;

app.get("/", (req, res) => {
    res.send({ "message": "welcome to back" })
})

io.on("connection", wsController);

server.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})