const express = require('express');
const morgan = require('morgan');
const winston = require('./logger');
const process = require('process');
const cors = require('cors');

const PORT = require('./config').PORT;
const router = require('./routes/index');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wsController = require('./controllers/ws').handleWS;

app.use(cors());
app.use(express.json());

app.use(morgan('combined', {stream: winston.stream}));

app.get('/', (_, res) => {
  res.send({message: 'pende back-end'});
});

io.on('connection', wsController);

app.use('/api', router);

app.use((err, req, res, next) => {
  winston.error(err.stack);

  res
      .status(err.status || 500)
      .send({message: err.message || 'Unknown error occurred'});
});

process.on('uncaughtException', (err) => {
  winston.error(err.stack);
});

server.listen(PORT, () => {
  console.log('pende-back started on http://localhost:' + PORT);
});
