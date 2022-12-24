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

    createRoom(): void {
        // todo
    }

    addToRoom(player: any) {

    }

    deleteRoom(): void {
        // todo
    }

    findRoom(roomID: string): RoomManager | undefined {
        return this.sessions.get(roomID);
    }

    // findPlayerRoom(player: Player): RoomManager | null {
    // }

    // code from https://socket.io/get-started/private-messaging-part-2/ 
    private setupMiddleware() {
        this.io.use((socket: any, next: any) => {
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

    private setupSocket() {
        this.io.on("connection", (socket: any) => {
            
            console.log("a user connected");
            let player = new Player(socket);

            socket.on("join", (data: any) => {
                console.log("a user has tried to join");
                console.log(data);
                console.log(typeof data);
                let room = this.findRoom(data.toString());
                if (!room) {
                    socket.emit("join", "Room does not exist");
                } else {
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
            })

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
            })

            socket.on("disconnect", () => {
                // let room = this.findPlayerRoom(player);
                // if (room) {
                //     room.removePlayer(player);
                // }
                console.log("user disconnected");
            });

            socket.onAny((event: any, data: any) => {
                this.routeRequest(event, data);
            })
        });
    }
}