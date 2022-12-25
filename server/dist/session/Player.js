"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socket) {
        this.id = socket.id;
        this.name = "Player " + this.id;
        this.socket = socket;
    }
    setId(id) {
        this.id = id;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getSocket() {
        return this.socket;
    }
}
exports.Player = Player;
