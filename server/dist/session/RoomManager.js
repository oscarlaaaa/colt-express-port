"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const LobbyRoomState_1 = require("./roomstates/LobbyRoomState");
class RoomManager {
    constructor(display, io) {
        this.roomId = RoomManager.idNum++;
        this.roomState = new LobbyRoomState_1.LobbyRoomState(this);
        this.players = new Map();
        this.host = null;
        this.display = display;
        this.io = io;
    }
    setState(roomState) {
        this.roomState = roomState;
    }
    setHost(host) {
        this.host = host;
    }
    getDisplay() {
        return this.display;
    }
    hasPlayer(player) {
        return this.players.get(player.getId());
    }
    addPlayer(player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.getId(), player);
        console.log(this.players);
    }
    removePlayer(player) {
        this.players.delete(player.getId());
    }
    getHost() {
        return this.host;
    }
    getPlayer(playerID) {
        return this.players.get(playerID);
    }
    getPlayers() {
        return this.players;
    }
    getInfo() {
        var _a;
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": JSON.stringify(Object.fromEntries(this.players)),
            "host": (_a = this.host) === null || _a === void 0 ? void 0 : _a.getId()
        });
    }
    getId() {
        return this.roomId;
    }
    receiveMessage(event, message) {
        if (message.playerID === "all") {
        }
        else {
            const player = this.getPlayer(message.playerID);
            if (!player) {
                // player isn't in this room
            }
            else {
                // send message to the player
            }
        }
    }
    sendMessage(event, message, player) {
        if (player === null) {
            Object.keys(this.players).forEach((key) => {
                var _a;
                let socket = (_a = this.players.get(key)) === null || _a === void 0 ? void 0 : _a.getSocket();
                socket.emit(event, message);
            });
        }
        else {
            let socket = player.getSocket();
            socket.emit(event, message);
        }
    }
    clearDisconnected() {
    }
}
exports.RoomManager = RoomManager;
RoomManager.idNum = 1;
