import { RoomManager } from "../../RoomManager";
import { RoomState } from "../IRoomState";
import { LobbyRoomState } from "../lobby/LobbyRoomState";

export class ResultsRoomState implements RoomState {
    room: RoomManager;
    nextState: RoomState;

    constructor(room: RoomManager) {
        this.room = room;
        this.nextState = new LobbyRoomState(this.room);
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