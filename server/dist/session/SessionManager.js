"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const Player_1 = require("./Player");
const RoomFactory_1 = require("./RoomFactory");
class SessionManager {
    constructor(io) {
        this.sessions = new Map();
        this.sessionFactory = RoomFactory_1.RoomFactory.getInstance();
        this.io = io;
        this.setupMiddleware();
        this.setupSocket();
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
    findRoom(roomID) {
        return this.sessions.get(roomID);
    }
    // findPlayerRoom(player: Player): RoomManager | null {
    // }
    // code from https://socket.io/get-started/private-messaging-part-2/ 
    setupMiddleware() {
        this.io.use((socket, next) => {
            console.log(socket.handshake.auth);
            const roomID = socket.handshake.auth.roomID;
            const userID = socket.handshake.auth.userID;
            if (roomID && userID) {
                socket.roomID = roomID;
                socket.userID = userID;
                return next();
            }
            next();
        });
    }
    setupSocket() {
        this.io.on("connection", (socket) => {
            console.log("a user connected");
            let player = new Player_1.Player(socket);
            socket.on("join", (data) => {
                console.log("a user has tried to join");
                console.log(data);
                console.log(typeof data);
                let room = this.findRoom(data.toString());
                if (!room) {
                    socket.emit("join", "Room does not exist");
                }
                else {
                    if (!socket.roomID && !socket.userID) {
                        room.addPlayer(player);
                        socket.emit("session", {
                            roomID: room.getId(),
                            userID: player.getId(),
                            isHost: false
                        });
                    }
                    socket.emit("join", room.getInfo());
                }
            });
            socket.on("create", () => {
                let room = this.sessionFactory.buildRoom();
                room.setHost(player);
                this.sessions.set(room.getId().toString(), room);
                socket.emit("create", room.getInfo());
                socket.emit("session", {
                    roomID: room.getId(),
                    userID: player.getId(),
                    isHost: true
                });
            });
            socket.on("disconnect", () => {
                // let room = this.findPlayerRoom(player);
                // if (room) {
                //     room.removePlayer(player);
                // }
                console.log("user disconnected");
            });
            socket.onAny((event, data) => {
                this.routeRequest(event, data);
            });
        });
    }
}
exports.SessionManager = SessionManager;
