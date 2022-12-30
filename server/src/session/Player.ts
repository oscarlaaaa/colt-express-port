import { Socket } from "socket.io";

export class Player {
    private _id: string;
    private _name: string;

    constructor(socket: Socket) {
        this._id = socket.id;
        this._name = "Player " + this.id;
    }

    public get id() {
        return this._id;
    }
    public set id(id: string) {
        this._id = id;
    }

    public get name() {
        return this._name;
    }
    public set name(name: string) {
        this._name = name;
    }
}
