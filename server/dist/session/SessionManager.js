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
        this.sessions.set(room.getRoomId().toString(), room);
        return room;
    }
    deleteRoom(roomID) {
        return this.sessions.delete(roomID);
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
            // set up room join and creation listeners
            socket.on("join", (roomID) => {
                console.log("a user has tried to join");
                let room = socket.roomID ? this.findRoom(socket.roomID) : this.findRoom(roomID);
                if (!room) {
                    socket.emit("join", { status: 400, message: "Room does not exist" });
                }
                else {
                    if (!socket.roomID && !socket.userID) {
                        room.addPlayer(player);
                        this.setupSession(player, room, socket);
                    }
                    socket.emit("join", { status: 200, roomID: room.getRoomId() });
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
        });
    }
    setupSession(player, room, socket) {
        socket.emit("session", {
            roomID: room.getRoomId(),
            userID: player.id,
            isHost: player.id === room.getHostID(),
            isDisplay: player.id === room.getDisplayID()
        });
        socket.roomID = room.getRoomId().toString();
        socket.userID = player.id;
        socket.isHost = player.id === room.getHostID();
        socket.isDisplay = player.id === room.getDisplayID();
        // turn off unnecessary listeners
        socket.removeAllListeners("join");
        socket.removeAllListeners("create");
    }
}
exports.SessionManager = SessionManager;
