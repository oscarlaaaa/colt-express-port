import { RoomManager } from "../RoomManager";
import { RoomState } from "./IRoomState";

export class PlayingRoomState implements RoomState {
    room: RoomManager;
    nextState: RoomState;

    constructor(room: RoomManager) {
        this.room = room;
        this.nextState = null;
    }
    goNextState(): void {
        throw new Error("Method not implemented.");
    }
    processMessage(message: any): void {
        throw new Error("Method not implemented.");
    }
    setupListeners(): void {
        throw new Error("Method not implemented.");
    }
    cleanupState(): void {
        throw new Error("Method not implemented.");
    }
    
}