import { RoomManager } from "./RoomManager";

export class RoomFactory {
    static instance: RoomFactory | null;

    private constructor() {}

    static getInstance() {
        if (!this.instance)
            this.instance = new RoomFactory();
        return this.instance;
    }

    buildRoom() {
        return new RoomManager();
    }
}