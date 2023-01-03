"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const LobbyRoomState_1 = require("./roomstates/lobby/LobbyRoomState");
class RoomManager {
    constructor(display, io) {
        this.roomId = RoomManager.idNum++;
        this.roomState = new LobbyRoomState_1.LobbyRoomState(this);
        this.players = new Map();
        this.host = null;
        this.display = display;
        this.io = io;
    }
    getRoomId() {
        return this.roomId;
    }
    setState(roomState) {
        this.roomState = roomState;
    }
    setHost(host) {
        this.host = host;
    }
    getHostID() {
        if (this.host)
            return this.host.id;
        return null;
    }
    getDisplayID() {
        return this.display.id;
    }
    getPlayer(playerID) {
        const player = this.players.get(playerID);
        if (!player)
            return null;
        return player;
    }
    getPlayers() {
        return this.players;
    }
    addPlayer(player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.id, player);
        this.roomState.addPlayer(player.id);
        console.log(this.players);
    }
    removePlayer(player) {
        this.players.delete(player.id);
    }
    getInfo() {
        var _a;
        return JSON.stringify({
            id: this.roomId,
            state: this.roomState.toString(),
            players: Array.from(this.players.keys()),
            host: (_a = this.host) === null || _a === void 0 ? void 0 : _a.id,
        });
    }
    getIO() {
        return this.io;
    }
    getPlayerSocket(playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            const players = yield this.io.in(playerID).fetchSockets();
            if (players.length != 1)
                return null;
            return players[0];
        });
    }
    getAllPlayerSockets() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.players.size == 0)
                return [];
            let io = this.io;
            Object.keys(this.players).forEach((userID) => __awaiter(this, void 0, void 0, function* () {
                io = io.in(userID);
            }));
            let sockets = yield io.fetchSockets();
            return sockets;
        });
    }
    sendMessage(event, message, playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("Outgoing message to " + playerID + ": " + message);
            if (playerID === null) {
                Object.keys(this.players).forEach((userID) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(userID).emit(event, message);
                }));
            }
            else {
                this.io.to(playerID).emit(event, message);
            }
        });
    }
    cleanupRoom() {
        return __awaiter(this, void 0, void 0, function* () {
            let sockets = yield this.getAllPlayerSockets();
            if (sockets.length === 0)
                return;
            for (let socket of sockets) {
                socket.disconnect();
            }
        });
    }
    clearDisconnected() {
        // stub
    }
}
exports.RoomManager = RoomManager;
RoomManager.idNum = 1;
