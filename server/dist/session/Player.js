"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socket) {
        this.id = Player.idNum++;
        this.name = "Player " + this.id;
        this.socket = socket;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    isConnected() {
        return this.socket.connected;
    }
}
exports.Player = Player;
Player.idNum = 1;
