import { Player } from "./Player";

export class RoomManager {
    static idNum: number = 1;

    private roomId: number;
    private roomState: any;
    private players: any;
    private host: Player | null;
    
    constructor() {
        this.roomId = RoomManager.idNum++;
        this.roomState = null;
        this.players = {};
        this.host = null;
    }

    hasPlayer(player: Player) {
        return player.getId() in this.players;
    }

    addPlayer(player: Player) {
        if (!this.host) {
            this.host = player
        } 
        this.players[player.getId()] = player.getName();
    }

    removePlayer(player: Player) {
        delete this.players[player.getId()]
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
        let obj = this;
        Object.keys(this.players).forEach(function(id) {
            if (!obj.players[id].isConnected()) {
                delete obj.players[id];
            }
        });
    }
}