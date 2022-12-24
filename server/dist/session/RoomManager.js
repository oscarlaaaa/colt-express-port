"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor(roomId) {
        this.roomId = roomId;
        this.roomState = null;
        this.players = [];
        this.host = null;
    }
    hasPlayer(player) {
        return this.players.includes(player.getId());
    }
    setHost(host) {
        this.host = host;
    }
    addPlayer(player) {
        this.players.push(player.getId());
    }
    removePlayer(player) {
        const index = this.players.indexOf(player.getId());
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }
    getPlayers() {
        return this.players;
    }
    getInfo() {
        var _a;
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": this.players,
            "host": (_a = this.host) === null || _a === void 0 ? void 0 : _a.getId()
        });
    }
    getId() {
        return this.roomId;
    }
    clearDisconnected() {
    }
}
exports.RoomManager = RoomManager;
