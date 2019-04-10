const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan');
const fs = require('fs');
const PORT = 8000
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wsController = require('./controllers/ws').handleWS;
const router = require('./routes/index');

app.use(cors());
app.use(express.json())
app.use(morgan("combined", { stream: fs.createWriteStream("./logs/logs", { flags: "a" }) }));

app.get("/", (req, res) => {
    res.send({ "message": "welcome to back" })
})

io.on("connection", wsController);

app.use("/api", router);

server.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})