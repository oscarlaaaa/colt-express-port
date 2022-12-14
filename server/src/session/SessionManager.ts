import { Player } from "./Player";
import { RoomFactory } from "./RoomFactory";
import { RoomManager } from "./RoomManager";
import { Socket, Server } from "socket.io";
import { PlayerSocket } from "./PlayerSocket";

export class SessionManager {
    private sessions: Map<string, RoomManager>;
    private sessionFactory: RoomFactory;
    private io: Server;

    constructor(io: any) {
        this.sessions = new Map();
        this.sessionFactory = RoomFactory.getInstance();
        this.io = io;

        this.setupMiddleware();
        this.setupSocket();
    }

    clearEmptyRooms (): void {
        // todo
    }

    createRoom (display: Player): RoomManager {
        let room = this.sessionFactory.buildRoom(display, this.io);
        this.sessions.set(room.getRoomId().toString(), room);
        return room;
    }

    deleteRoom (roomID: string): boolean {
        return this.sessions.delete(roomID);
    }

    findRoom (roomID: string): RoomManager | undefined {
        return this.sessions.get(roomID);
    }

    // code from https://socket.io/get-started/private-messaging-part-2/
    private setupMiddleware () {
        this.io.use((socket: any, next: any) => {
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

    private setupSocket () {
        this.io.on("connection", (socket: PlayerSocket) => {
            console.log("a user connected");

            // set up the channel the player communicates through
            let player: Player | null = null;
            if (socket.userID && socket.roomID) {
                let room = this.findRoom(socket.roomID);
                if (room) {
                    player = room.getPlayer(socket.userID);
                }
            }
            if (player === null) player = new Player(socket);

            socket.join(player.id);

            // set up room join and creation listeners
            socket.on("join", (roomID: string) => {
                console.log("a user has tried to join");
                let room = this.findRoom(roomID);
                if (!room) {
                    socket.emit("join", { status: 400, message: "Room does not exist" });
                } else {
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
                    if (room?.getDisplayID() === player?.id) {
                        room?.cleanupRoom();
                        this.deleteRoom(socket.roomID);
                    }
                }
                console.log("user disconnected");
            });
        });
    }

    setupSession (player: Player, room: RoomManager, socket: PlayerSocket) {
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
