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
            const { roomID, userID, isHost, isDisplay } = socket.handshake.auth;
            if (roomID && userID) {
                socket.roomID = roomID;
                socket.userID = userID;
                socket.isHost = isHost;
                socket.isDisplay = isDisplay;
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
            socket.join(player.id);
            // set up room join and creation listeners
            socket.on("join", (roomID) => {
                console.log("a user has tried to join");
                let room = this.findRoom(roomID);
                if (!room) {
                    socket.emit("join", { status: 400, message: "Room does not exist" });
                }
                else {
                    if (player !== null) {
                        this.setupSession(player, room, socket);
                        room.addPlayer(player);
                        socket.emit("join", { status: 200, roomID: room.getRoomId() });
                    }
                }
            });
            socket.on("create", () => {
                console.log("a user has tried to create a game");
                if (player) {
                    let room = this.createRoom(player);
                    socket.emit("create", room.getInfo());
                    this.setupSession(player, room, socket);
                }
            });
            socket.on("disconnect", () => {
                if (socket.roomID) {
                    let room = this.findRoom(socket.roomID);
                    if ((room === null || room === void 0 ? void 0 : room.getDisplayID()) === (player === null || player === void 0 ? void 0 : player.id)) {
                        room === null || room === void 0 ? void 0 : room.cleanupRoom();
                        this.deleteRoom(socket.roomID);
                    }
                }
                console.log("user disconnected");
            });
        });
    }
    setupSession(player, room, socket) {
        socket.emit("session", {
            roomID: room.getRoomId(),
            userID: player.id,
            isHost: player.id === room.getHostID(),
            isDisplay: player.id === room.getDisplayID(),
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
