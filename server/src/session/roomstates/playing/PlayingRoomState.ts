import { RoomManager } from "../../RoomManager";
import { RoomState } from "../IRoomState";
import { ResultsRoomState } from "../results/ResultsRoomState";

export class PlayingRoomState implements RoomState {
    room: RoomManager;
    nextState: RoomState;

    constructor(room: RoomManager) {
        this.room = room;
        this.nextState = new ResultsRoomState(this.room);
    }
    goNextState(): void {
        throw new Error("Method not implemented.");
    }
    setupListeners(): void {
        throw new Error("Method not implemented.");
    }
    cleanupState(): void {
        throw new Error("Method not implemented.");
    }
    
}