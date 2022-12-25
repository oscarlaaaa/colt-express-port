import { Player } from "./Player";
import { RoomState } from "./roomstates/IRoomState";
import { LobbyRoomState } from "./roomstates/LobbyRoomState";
import { PlayingRoomState } from "./roomstates/PlayingRoomState";

export class RoomManager {
    static idNum = 1;
    private roomId: number;
    private roomState: RoomState;
    private players: Map<String, Player>;
    private host: Player | null;
    private display: Player;
    private io: any;
    
    constructor(display: Player, io: any) {
        this.roomId = RoomManager.idNum++;
        this.roomState = new LobbyRoomState(this);
        this.players = new Map();
        this.host = null;
        this.display = display;
        this.io = io;
    }

    setState(roomState: RoomState) {
        this.roomState = roomState;
    }

    setHost(host: Player) {
        this.host = host;
    }

    getDisplay(): Player {
        return this.display;
    }

    hasPlayer(player: Player): Player | undefined {
        return this.players.get(player.getId());
    }

    addPlayer(player: Player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.getId(), player);
        console.log(this.players);
    }

    removePlayer(player: Player) {
        this.players.delete(player.getId());
    }

    getHost(): Player | null {
        return this.host;
    }

    getPlayer(playerID: string): Player | undefined {
        return this.players.get(playerID);
    }

    getPlayers() {
        return this.players;
    }

    getInfo() {
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": JSON.stringify(Object.fromEntries(this.players)),
            "host": this.host?.getId()
        })
    }

    getId() {
        return this.roomId;
    }

    receiveMessage(event: string, message: any) {
        if (message.playerID === "all") {
            
        } else {
            const player = this.getPlayer(message.playerID);
            if (!player) {
                // player isn't in this room
            } else {
                // send message to the player
            }
        }
    }
    
    sendMessage(event: string, message: any, player: Player | null) {
        if (player === null) {
            Object.keys(this.players).forEach((key) => {
                let socket = this.players.get(key)?.getSocket();
                socket.emit(event, message);
            });
        } else {
            let socket = player.getSocket();
            socket.emit(event, message);
        }
    }

    clearDisconnected() {
        
    }
}