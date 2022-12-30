import express from 'express'
import http from 'http'
import { Server } from "socket.io";
import { SessionManager } from "./session/SessionManager";

const port: number = 8000

class App {
    private server: http.Server
    private port: number

    private io: Server
    private sessionManager: SessionManager;

    constructor(port: number) {
        this.port = port;

        const app = express();

        this.server = new http.Server(app)
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
            }
        });
        this.sessionManager = new SessionManager(this.io);

        app.get('/', (req: any, res: any) => {
            res.sendFile(__dirname + '/assets/index.html');
        });
    }

    public Start() {
        this.server.listen(this.port)
        console.log(`Server listening on port ${this.port}.`)
    }
}

new App(port).Start()