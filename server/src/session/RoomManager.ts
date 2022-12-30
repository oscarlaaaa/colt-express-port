import { Player } from "./Player";
import { RoomState } from "./roomstates/IRoomState";
import { LobbyRoomState } from "./roomstates/lobby/LobbyRoomState";
import { Socket, Server } from "socket.io"

export class RoomManager {
    static idNum = 1;
    private roomId: number;
    private roomState: RoomState;
    private players: Map<String, Player>;
    private host: Player | null;
    private display: Player;
    private io: Server;
    
    constructor(display: Player, io: Server) {
        this.roomId = RoomManager.idNum++;
        this.roomState = new LobbyRoomState(this);
        this.players = new Map();
        this.host = null;
        this.display = display;
        this.io = io;
    }

    getRoomId() {
        return this.roomId;
    }
    
    setState(roomState: RoomState) {
        this.roomState = roomState;
    }

    setHost(host: Player) {
        this.host = host;
    }

    getHostID(): string | undefined {
        return this.host?.id;
    }

    getDisplayID(): string {
        return this.display.id;
    }

    getPlayer(playerID: string): Player | undefined {
        return this.players.get(playerID);
    }
    
    getPlayers() {
        return this.players;
    }

    addPlayer(player: Player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.id, player);
        console.log(this.players);
    }

    removePlayer(player: Player) {
        this.players.delete(player.id);
    }  

    getInfo() {
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": JSON.stringify(Object.fromEntries(this.players)),
            "host": this.host?.id
        })
    }

    async getPlayerSocket(playerID: string): Promise<any> {
        const players = await this.io.in(playerID).fetchSockets();
        if (players.length != 1)
            return null;
        return players[0];
    }

    async getAllPlayerSockets(): Promise<any[]> {
        let io: any = this.io;
        Object.keys(this.players).forEach(async (userID) => {
            io = io.in(userID);
        });
        return await io.fetchSockets();
    }

    async sendMessage(event: string, message: any, playerID: string | null) {
        if (playerID === null) {
            Object.keys(this.players).forEach(async (userID) => {
                const player = this.players.get(userID);
                if (player) {
                    let socket = await this.getPlayerSocket(userID);
                    socket?.emit(event, message);
                }
            });
        } else {
            let socket = await this.getPlayerSocket(playerID);
            socket?.emit(event, message);
        }
    }

    clearDisconnected() {
        // stub
    }
}
