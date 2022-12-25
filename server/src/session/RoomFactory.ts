import { RoomManager } from "./RoomManager";
import { Player } from "./Player";

export class RoomFactory {
    static instance: RoomFactory | null;

    private constructor() {}

    static getInstance() {
        if (!this.instance)
            this.instance = new RoomFactory();
        return this.instance;
    }

    buildRoom(display: Player, io: any) {
        return new RoomManager(display, io);
    }
}