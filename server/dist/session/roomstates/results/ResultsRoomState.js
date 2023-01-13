"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsRoomState = void 0;
class ResultsRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = null;
    }
    addPlayer(playerID) {
        throw new Error("Method not implemented.");
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
    toString() {
        return "Results Room";
    }
}
exports.ResultsRoomState = ResultsRoomState;
