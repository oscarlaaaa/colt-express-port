"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyRoomState = void 0;
const PlayingRoomState_1 = require("./PlayingRoomState");
class LobbyRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = new PlayingRoomState_1.PlayingRoomState(this.room);
        this.readyPlayers = new Map();
        this.setupListeners();
    }
    goNextState() {
        this.cleanupState();
        this.room.setState(this.nextState);
    }
    processMessage(message) {
        throw new Error("Method not implemented.");
    }
    setupListeners() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            var _a;
            let socket = (_a = players.get(key)) === null || _a === void 0 ? void 0 : _a.getSocket();
            socket.on("toggle_ready", () => {
                let ready = this.readyPlayers.get(socket.userID);
                if (ready === undefined) {
                    console.error("That's super weird, how can you toggle ready if you're not in this room?");
                }
                else {
                    this.readyPlayers.set(socket.userID, !ready);
                    const display = this.room.getDisplay();
                    this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), display);
                }
            });
        });
    }
    setupReadyMap() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            this.readyPlayers.set(key, false);
        });
    }
    readyToStart() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            if (!this.readyPlayers.get(key))
                return false;
        });
        this.goNextState();
    }
    cleanupState() {
        this.cleanupListeners();
    }
    cleanupListeners() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            var _a;
            let socket = (_a = players.get(key)) === null || _a === void 0 ? void 0 : _a.getSocket();
            socket.off("toggleReady");
        });
    }
}
exports.LobbyRoomState = LobbyRoomState;
