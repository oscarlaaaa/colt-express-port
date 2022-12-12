const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req: any, res: any) => {
  res.sendFile(__dirname + '/assets/index.html');
});

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('chat message', (msg: any) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is listening at https://localhost:${port}`);
});