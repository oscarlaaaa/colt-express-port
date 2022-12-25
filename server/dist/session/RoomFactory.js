"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomFactory = void 0;
const RoomManager_1 = require("./RoomManager");
class RoomFactory {
    constructor() { }
    static getInstance() {
        if (!this.instance)
            this.instance = new RoomFactory();
        return this.instance;
    }
    buildRoom(display, io) {
        return new RoomManager_1.RoomManager(display, io);
    }
}
exports.RoomFactory = RoomFactory;
