"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socket) {
        this.id = socket.id;
        this.name = "Player " + this.id;
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
}
exports.Player = Player;
