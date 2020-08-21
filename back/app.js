const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const PORT = require('./config').PORT;
const router = require('./routes/index');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wsController = require('./controllers/ws').handleWS;

app.use(cors());
app.use(express.json());
app.use(morgan('combined', {stream: fs.createWriteStream('./logs', {flags: 'a'})}));

app.get('/', (req, res) => {
  res.send({'message': 'pende back-end'});
});

io.on('connection', wsController);

app.use('/api', router);

server.listen(PORT, () => {
  console.log('pende-back started on http://localhost:' + PORT);
});
