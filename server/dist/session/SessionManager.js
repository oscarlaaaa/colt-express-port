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
    createRoom(display) {
        let room = this.sessionFactory.buildRoom(display, this.io);
        this.sessions.set(room.getId().toString(), room);
        return room;
    }
    addToRoom(player) {
    }
    deleteRoom(room) {
        return this.sessions.delete(room.getId().toString());
    }
    findRoom(roomID) {
        return this.sessions.get(roomID);
    }
    // code from https://socket.io/get-started/private-messaging-part-2/ 
    setupMiddleware() {
        this.io.use((socket, next) => {
            console.log(socket.handshake.auth);
            const { roomID, userID, isHost } = socket.handshake.auth;
            if (roomID && userID) {
                socket.roomID = roomID;
                socket.userID = userID;
                socket.isHost = isHost;
                return next();
            }
            next();
        });
    }
    setupSocket() {
        this.io.on("connection", (socket) => {
            console.log("a user connected");
            // set up the channel the player communicates through
            let player = null;
            if (socket.userID && socket.roomID) {
                let room = this.findRoom(socket.roomID);
                if (room) {
                    player = room.getPlayer(socket.userID);
                }
            }
            if (player === null)
                player = new Player_1.Player(socket);
            socket.join(player.getId());
            socket.on("join", () => {
                console.log("a user has tried to join");
                let room = this.findRoom(socket.roomID);
                if (!room) {
                    socket.emit("join", { status: 400, message: "Room does not exist" });
                }
                else {
                    if (!socket.roomID && !socket.userID) {
                        room.addPlayer(player);
                        this.setupSession(player, room, socket);
                    }
                    socket.emit("join", { status: 200, roomID: room.getId() });
                }
            });
            socket.on("create", () => {
                let room = this.createRoom(player);
                socket.emit("create", room.getInfo());
                this.setupSession(player, room, socket);
            });
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
            socket.onAny((event, data) => {
                if (socket.roomID) {
                    let room = this.sessions.get(socket.roomID);
                    room === null || room === void 0 ? void 0 : room.receiveMessage(event, data);
                }
            });
        });
    }
    setupSession(player, room, socket) {
        socket.emit("session", {
            roomID: room.getId(),
            userID: player.getId(),
            isHost: player === room.getHost(),
            isDisplay: player === room.getDisplay()
        });
        socket.roomID = room.getId();
        socket.userID = player.getId();
        socket.isHost = player === room.getHost();
        socket.isDisplay = player === room.getDisplay();
    }
}
exports.SessionManager = SessionManager;
