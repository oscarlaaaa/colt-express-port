import { RoomManager } from "../RoomManager";

export interface RoomState {
    room: RoomManager;
    nextState: RoomState;

    goNextState(): void;
    setupListeners(): void;
    cleanupState(): void;
}