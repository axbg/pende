const express = require("express")
const app = express()
const cors = require('cors')
const PORT = 8000
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wsController = require('./controllers/ws').handleWS;
const router = require('./routes/index');
const mongoose = require('./models/index').mongoose

/*
const UserModel = mongoose.model("user");
let usr = new UserModel({filetree: {name: "Asdd"}});
usr.save();
*/

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send({ "message": "welcome to back" })
})

io.on("connection", wsController);



app.use("/api", router);

server.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})