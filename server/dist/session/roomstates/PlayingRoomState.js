"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayingRoomState = void 0;
class PlayingRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = null;
    }
    goNextState() {
        throw new Error("Method not implemented.");
    }
    processMessage(message) {
        throw new Error("Method not implemented.");
    }
    setupListeners() {
        throw new Error("Method not implemented.");
    }
    cleanupState() {
        throw new Error("Method not implemented.");
    }
}
exports.PlayingRoomState = PlayingRoomState;
