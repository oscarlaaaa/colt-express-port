export class Player {
    private id: string;
    private name: string;
    private socket: any;

    constructor(socket: any) {
        this.id = socket.id;
        this.name = "Player " + this.id;
        this.socket = socket;
    }

    setId(id: string) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getSocket() {
        return this.socket;
    }
}