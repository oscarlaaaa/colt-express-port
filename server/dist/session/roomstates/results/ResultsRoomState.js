"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsRoomState = void 0;
const LobbyRoomState_1 = require("../lobby/LobbyRoomState");
class ResultsRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = new LobbyRoomState_1.LobbyRoomState(this.room);
    }
    goNextState() {
        throw new Error("Method not implemented.");
    }
    setupListeners() {
        throw new Error("Method not implemented.");
    }
    cleanupState() {
        throw new Error("Method not implemented.");
    }
}
exports.ResultsRoomState = ResultsRoomState;
