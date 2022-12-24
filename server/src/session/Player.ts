export class Player {
    private id: string;
    private name: string;

    constructor(socket: any) {
        this.id = socket.id;
        this.name = "Player " + this.id;
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
}