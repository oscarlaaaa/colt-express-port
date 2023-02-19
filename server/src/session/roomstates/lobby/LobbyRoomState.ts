import { RoomManager } from "../../RoomManager";
import { RoomState } from "../IRoomState";
import { PlayingRoomState } from "../playing/PlayingRoomState";
import { Ruleset } from "./Ruleset";

export class LobbyRoomState implements RoomState {
    room: RoomManager;
    nextState: RoomState;
    readyPlayers: Map<String, boolean>;  // <player id, ready status>
    ruleset: Ruleset;
    
    constructor(room: RoomManager) {
        this.room = room;
        this.nextState = new PlayingRoomState(this.room);
        this.readyPlayers = new Map<String, boolean>();
        this.ruleset = new Ruleset();
    }

    togglePlayerReady(playerID: string) {
        let ready = this.readyPlayers.get(playerID);
        if (ready !== undefined)
            this.readyPlayers.set(playerID, !ready);
    }

    addPlayer(playerID: string): void {
        this.readyPlayers.set(playerID, false);
        this.room.getPlayerSocket(playerID).then(socket => {
            socket.on("toggle_ready", () => {
                let ready = this.readyPlayers.get(socket.userID);
                if (ready === undefined) {
                    console.error("That's super weird, how can you toggle ready if you're not in this room?")
                } else {
                    this.togglePlayerReady(socket.userID);
                    const display = this.room.getDisplayID();
                    this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), display);
                    this.room.sendMessage("toggle_ready", !ready, socket.userID);

                    // send current ruleset to the host if they're ready
                    if (socket.userID === this.room.getHostID() && this.readyPlayers.get(socket.userID))
                        this.room.sendMessage("select_ruleset", this.ruleset.toString(), socket.userID);
                }
            })

            if (socket.userID === this.room.getHostID()) {
                socket.on("select_ruleset", (data: any) => {
                    try {
                        let ruleset = Ruleset.JSONToRuleset(data);
                        this.ruleset = ruleset;
                        this.room.sendMessage("select_ruleset", this.ruleset.toString(), socket.userID);
                    } catch (e: any) {
                        console.error(e);
                        console.error("That's weird, failed to update ruleset.");
                        this.room.sendMessage("select_ruleset", JSON.stringify({"status": 400}), socket.userID);
                    }
                })
            }
            this.room.sendMessage("toggle_ready", false, playerID);
            this.room.sendMessage("create", this.room.getInfo(), this.room.getDisplayID());
        })
        this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), this.room.getDisplayID());
    }

    goNextState(): void {
        this.cleanupState();
        this.room.setState(this.nextState);
    }

    setupListeners(): void {
        
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
        this.room.getAllPlayerSockets().then(sockets => {
            for (const socket of sockets) {
                socket.off("toggleReady");
            }
        });
    }

    toString(): string {
        return "Lobby Room";
    }
}