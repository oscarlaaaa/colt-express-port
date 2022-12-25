import { RoomManager } from "../RoomManager";
import { RoomState } from "./IRoomState";
import { PlayingRoomState } from "./PlayingRoomState";

export class LobbyRoomState implements RoomState {
    room: RoomManager;
    nextState: RoomState;
    readyPlayers: Map<String, boolean>;

    constructor(room: RoomManager) {
        this.room = room;
        this.nextState = new PlayingRoomState(this.room);
        this.readyPlayers = new Map();
        this.setupListeners();
    }

    goNextState(): void {
        this.cleanupState();
        this.room.setState(this.nextState);
    }

    processMessage(message: any): void {
        throw new Error("Method not implemented.");
    }

    setupListeners(): void {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            let socket = players.get(key)?.getSocket();

            socket.on("toggle_ready", () => {
                let ready = this.readyPlayers.get(socket.userID);
                if (ready === undefined) {
                    console.error("That's super weird, how can you toggle ready if you're not in this room?")
                } else {
                    this.readyPlayers.set(socket.userID, !ready);
                    const display = this.room.getDisplay();
                    this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), display);
                }
            });
        });
    }


    setupReadyMap() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            this.readyPlayers.set(key, false);
        });
    }

    readyToStart() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            if (!this.readyPlayers.get(key))
                return false;
        });
        this.goNextState();
    }

    cleanupState(): void {
        this.cleanupListeners();
    }

    cleanupListeners(): void {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            let socket = players.get(key)?.getSocket();
            socket.off("toggleReady");
        });
    }
}