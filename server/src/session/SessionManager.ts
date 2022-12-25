import { Player } from "./Player";
import { RoomFactory } from "./RoomFactory";
import { RoomManager } from "./RoomManager";


export class SessionManager {
    private sessions: Map<string, RoomManager>;
    private sessionFactory: RoomFactory;
    private io: any;

    constructor(io: any) {
        this.sessions = new Map();
        this.sessionFactory = RoomFactory.getInstance();
        this.io = io;

        this.setupMiddleware();
        this.setupSocket();
    }

    routeRequest(event: any, data: any): void {
        switch (event) {
            case "ping":
                console.log("ping received");
                this.io.emit("pong", data);
        }
    }

    clearEmptyRooms(): void {
        // todo
    }

    createRoom(display: Player): RoomManager {
        let room = this.sessionFactory.buildRoom(display, this.io);
        this.sessions.set(room.getId().toString(), room);
        return room;
    }

    addToRoom(player: any) {

    }

    deleteRoom(room: RoomManager): boolean {
        return this.sessions.delete(room.getId().toString());
    }

    findRoom(roomID: string): RoomManager | undefined {
        return this.sessions.get(roomID);
    }

    // code from https://socket.io/get-started/private-messaging-part-2/ 
    private setupMiddleware() {
        this.io.use((socket: any, next: any) => {
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

    private setupSocket() {
        this.io.on("connection", (socket: any) => {
            console.log("a user connected");

            // set up the channel the player communicates through
            let player: any = null;
            if (socket.userID && socket.roomID) {
                let room = this.findRoom(socket.roomID);
                if (room) {
                    player = room.getPlayer(socket.userID);
                }
            }
            if (player === null) 
                player = new Player(socket);
        
            socket.join(player.getId());

            socket.on("join", () => {
                console.log("a user has tried to join");
                let room = this.findRoom(socket.roomID);
                if (!room) {
                    socket.emit("join", { status: 400, message: "Room does not exist" });
                } else {
                    if (!socket.roomID && !socket.userID) {
                        room.addPlayer(player);
                        this.setupSession(player, room, socket);
                    }
                    socket.emit("join", { status: 200, roomID: room.getId() });
                }
            })

            socket.on("create", () => {
                let room = this.createRoom(player);
                socket.emit("create", room.getInfo());
                this.setupSession(player, room, socket);
            })

            socket.on("disconnect", () => {
                console.log("user disconnected");
            });

            socket.onAny((event: any, data: any) => {
                if (socket.roomID) {
                    let room = this.sessions.get(socket.roomID);
                    room?.receiveMessage(event, data);
                } 
            })
        });
    }

    setupSession(player: Player, room: RoomManager, socket: any) {
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