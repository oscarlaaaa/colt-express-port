"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const SessionManager_1 = require("./session/SessionManager");
const port = 8000;
class App {
    constructor(port) {
        this.port = port;
        const app = (0, express_1.default)();
        this.server = new http_1.default.Server(app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: '*',
            }
        });
        this.sessionManager = new SessionManager_1.SessionManager(this.io);
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/assets/index.html');
        });
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
