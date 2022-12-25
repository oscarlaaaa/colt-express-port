import { RoomManager } from "../RoomManager";

export interface RoomState {
    room: RoomManager;
    nextState: RoomState;

    goNextState(): void;
    processMessage(message: any): void;
    setupListeners(): void;
    cleanupState(): void;
}