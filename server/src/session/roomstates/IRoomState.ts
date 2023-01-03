import { RoomManager } from "../RoomManager";

export interface RoomState {
  room: RoomManager;
  nextState: RoomState | null;

  goNextState(): void;
  setupListeners(): void;
  cleanupState(): void;
  addPlayer(playerID: string): void;
}
