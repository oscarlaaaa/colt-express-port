import { Player } from "./Player";

export class RoomManager {
    private roomId: number;
    private roomState: any;
    private players: string[];
    private host: Player | null;
    
    constructor(roomId: number) {
        this.roomId = roomId;
        this.roomState = null;
        this.players = [];
        this.host = null;
    }

    hasPlayer(player: Player) {
        return this.players.includes(player.getId());
    }

    setHost(host: Player) {
        this.host = host;
    }

    addPlayer(player: Player) {
        this.players.push(player.getId());
    }

    removePlayer(player: Player) {
        const index = this.players.indexOf(player.getId());
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    getPlayers() {
        return this.players;
    }

    getInfo() {
        return JSON.stringify({
            "id": this.roomId,
            "state": this.roomState,
            "players": this.players,
            "host": this.host?.getId()
        })
    }

    getId() {
        return this.roomId;
    }

    clearDisconnected() {
        
    }
}