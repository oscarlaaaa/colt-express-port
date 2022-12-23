export class Player {
    static idNum: number = 1;

    private id: number;
    private name: string;
    private socket: any;

    constructor(socket: any) {
        this.id = Player.idNum++;
        this.name = "Player " + this.id;
        this.socket = socket;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    isConnected() {
        return this.socket.connected;
    }
}