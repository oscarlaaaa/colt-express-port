const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});


app.get('/', (req: any, res: any) => {
  res.sendFile(__dirname + '/assets/index.html');
});

io.on('connection', (socket: any) => {
  io.emit('connection');
  console.log('a user connected');
  socket.on('ping', (msg: any) => {
    io.emit('pong', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is listening at https://localhost:${port}`);
});