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
        var _a;
        return (_a = this.host) === null || _a === void 0 ? void 0 : _a.id;
    }
    getDisplayID() {
        return this.display.id;
    }
    getPlayer(playerID) {
        return this.players.get(playerID);
    }
    getPlayers() {
        return this.players;
    }
    addPlayer(player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.id, player);
        console.log(this.players);
    }
    removePlayer(player) {
        this.players.delete(player.id);
    }
    getInfo() {
        var _a;
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": JSON.stringify(Object.fromEntries(this.players)),
            "host": (_a = this.host) === null || _a === void 0 ? void 0 : _a.id
        });
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
            let io = this.io;
            Object.keys(this.players).forEach((userID) => __awaiter(this, void 0, void 0, function* () {
                io = io.in(userID);
            }));
            return yield io.fetchSockets();
        });
    }
    sendMessage(event, message, playerID) {
        return __awaiter(this, void 0, void 0, function* () {
            if (playerID === null) {
                Object.keys(this.players).forEach((userID) => __awaiter(this, void 0, void 0, function* () {
                    const player = this.players.get(userID);
                    if (player) {
                        let socket = yield this.getPlayerSocket(userID);
                        socket === null || socket === void 0 ? void 0 : socket.emit(event, message);
                    }
                }));
            }
            else {
                let socket = yield this.getPlayerSocket(playerID);
                socket === null || socket === void 0 ? void 0 : socket.emit(event, message);
            }
        });
    }
    clearDisconnected() {
        // stub
    }
}
exports.RoomManager = RoomManager;
RoomManager.idNum = 1;
