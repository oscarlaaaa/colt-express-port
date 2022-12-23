"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const Player_1 = require("./Player");
const RoomFactory_1 = require("./RoomFactory");
class SessionManager {
    constructor(io) {
        this.sessions = [];
        this.sessionFactory = RoomFactory_1.RoomFactory.getInstance();
        this.io = io;
        this.io.on("connection", (socket) => {
            console.log("a user connected");
            let player = new Player_1.Player(socket);
            socket.on("join", (data) => {
                console.log(typeof data);
                let room = this.findRoom(data * 1);
                if (!room) {
                    socket.emit("join", "No room with that ID exists.");
                }
                else {
                    room.addPlayer(player);
                    socket.emit("join", room.getInfo());
                }
            });
            socket.on("create", () => {
                let room = this.sessionFactory.buildRoom();
                room.addPlayer(player);
                this.sessions.push(room);
                socket.emit("create", room.getInfo());
            });
            socket.on("disconnect", () => {
                let room = this.findPlayerRoom(player);
                if (room) {
                    room.removePlayer(player);
                }
                console.log("user disconnected");
            });
            socket.onAny((event, data) => {
                this.routeRequest(event, data);
            });
        });
    }
    routeRequest(event, data) {
        switch (event) {
            case "ping":
                console.log("ping received");
                this.io.emit("pong", data);
        }
    }
    clearEmptyRooms() {
        // todo
    }
    createRoom() {
        // todo
    }
    addToRoom(player) {
    }
    deleteRoom() {
        // todo
    }
    findRoom(id) {
        for (let room of this.sessions) {
            console.log("room: " + room.getId());
            if (room.getId() === id) {
                return room;
            }
        }
        return null;
    }
    findPlayerRoom(player) {
        for (let room of this.sessions) {
            if (room.hasPlayer(player))
                return room;
        }
        return null;
    }
}
exports.SessionManager = SessionManager;
