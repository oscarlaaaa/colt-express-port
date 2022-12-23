"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor() {
        this.roomId = RoomManager.idNum++;
        this.roomState = null;
        this.players = {};
        this.host = null;
    }
    hasPlayer(player) {
        return player.getId() in this.players;
    }
    addPlayer(player) {
        if (!this.host) {
            this.host = player;
        }
        this.players[player.getId()] = player.getName();
    }
    removePlayer(player) {
        delete this.players[player.getId()];
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
        let obj = this;
        Object.keys(this.players).forEach(function (id) {
            if (!obj.players[id].isConnected()) {
                delete obj.players[id];
            }
        });
    }
}
exports.RoomManager = RoomManager;
RoomManager.idNum = 1;
