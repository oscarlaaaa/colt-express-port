import { Player } from "./Player";
import { RoomState } from "./roomstates/IRoomState";
import { LobbyRoomState } from "./roomstates/lobby/LobbyRoomState";
import { Socket, Server } from "socket.io";

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
        this.players = new Map<String, Player>();
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

    getHostID(): string | null {
        if (this.host) return this.host.id;
        return null;
    }

    getDisplayID(): string {
        return this.display.id;
    }

    getPlayer(playerID: string): Player | null {
        const player = this.players.get(playerID);
        if (!player) return null;
        return player;
    }

    getPlayers() {
        return this.players;
    }

    addPlayer(player: Player) {
        if (this.host === null) {
            this.host = player;
        }
        this.players.set(player.id, player);
        this.roomState.addPlayer(player.id);
        console.log(this.players);
    }

    removePlayer(player: Player) {
        this.players.delete(player.id);
    }

    getInfo() {
        return JSON.stringify({
            id: this.roomId,
            state: this.roomState.toString(),
            players: Array.from(this.players.keys()),
            host: this.host?.id,
        });
    }

    getIO() {
        return this.io;
    }

    async getPlayerSocket(playerID: string): Promise<any> {
        const players = await this.io.in(playerID).fetchSockets();
        if (players.length != 1) return null;
        return players[0];
    }

    async getAllPlayerSockets(): Promise<any[]> {
        if (this.players.size == 0) return [];
        let io: any = this.io;
        Object.keys(this.players).forEach(async (userID) => {
            io = io.in(userID);
        });
        let sockets = await io.fetchSockets();
        return sockets;
    }

    async sendMessage(event: string, message: any, playerID: string | null) {
        console.error("Outgoing message to " + playerID + ": " + message);
        if (playerID === null) {
            Object.keys(this.players).forEach(async (userID) => {
                this.io.to(userID).emit(event, message);
            });
        } else {
            this.io.to(playerID).emit(event, message);
        }
    }

    async cleanupRoom() {
        let sockets = await this.getAllPlayerSockets();
        if (sockets.length === 0) 
            return;
        for (let socket of sockets) {
            socket.disconnect();
        }
    }

    clearDisconnected() {
        // stub
    }
}
