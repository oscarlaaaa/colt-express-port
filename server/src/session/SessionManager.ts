import { Player } from "./Player";
import { RoomFactory } from "./RoomFactory";
import { RoomManager } from "./RoomManager";

export class SessionManager {
    private sessions: RoomManager[];
    private sessionFactory: RoomFactory;
    private io: any;

    constructor(io: any) {
        this.sessions = [];
        this.sessionFactory = RoomFactory.getInstance();
        this.io = io;

        this.io.on("connection", (socket: any) => {
            console.log("a user connected");
            let player = new Player(socket);

            socket.on("join", (data: any) => {
                console.log(typeof data);
                let room = this.findRoom(data*1);
                if (!room) {
                    socket.emit("join", "No room with that ID exists.");
                } else {
                    room.addPlayer(player);
                    socket.emit("join", room.getInfo());
                }
            })

            socket.on("create", () => {
                let room = this.sessionFactory.buildRoom();
                room.addPlayer(player);
                this.sessions.push(room);
                socket.emit("create", room.getInfo());
            })

            socket.on("disconnect", () => {
                let room = this.findPlayerRoom(player);
                if (room) {
                    room.removePlayer(player);
                }
                console.log("user disconnected");
            });

            socket.onAny((event: any, data: any) => {
                this.routeRequest(event, data);
            })
        });
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

    findRoom(id: number): RoomManager | null {
        for (let room of this.sessions) {
            console.log("room: " + room.getId());
            if (room.getId() === id) {
                return room;
            }
        }
        return null;
    }

    findPlayerRoom(player: Player): RoomManager | null {
        for (let room of this.sessions) {
            if (room.hasPlayer(player)) return room;
        }
        return null;
    }
}