"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayingRoomState = void 0;
const ResultsRoomState_1 = require("../results/ResultsRoomState");
class PlayingRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = new ResultsRoomState_1.ResultsRoomState(this.room);
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
        return "Playing Room";
    }
}
exports.PlayingRoomState = PlayingRoomState;
