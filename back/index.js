const express = require("express")
const app = express()
const PORT = 8000

app.get("/", (req, res) => {
    res.send({ "message": "welcome to back" })
})

app.listen(PORT, () => {
    console.log("webIDE back-end");
    console.log("started on http://localhost:" + PORT)
})