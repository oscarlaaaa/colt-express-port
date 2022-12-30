"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerSocket = void 0;
const socket_io_1 = require("socket.io");
class PlayerSocket extends socket_io_1.Socket {
    constructor(nsp, client, auth) {
        super(nsp, client, auth);
    }
}
exports.PlayerSocket = PlayerSocket;
