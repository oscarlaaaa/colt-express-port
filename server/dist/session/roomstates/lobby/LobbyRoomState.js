"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobbyRoomState = void 0;
const PlayingRoomState_1 = require("../playing/PlayingRoomState");
const Ruleset_1 = require("./Ruleset");
class LobbyRoomState {
    constructor(room) {
        this.room = room;
        this.nextState = new PlayingRoomState_1.PlayingRoomState(this.room);
        this.readyPlayers = new Map();
        this.ruleset = new Ruleset_1.Ruleset();
    }
    addPlayer(playerID) {
        this.readyPlayers.set(playerID, false);
        this.room.getPlayerSocket(playerID).then(socket => {
            socket.on("toggle_ready", () => {
                let ready = this.readyPlayers.get(socket.userID);
                if (ready === undefined) {
                    console.error("That's super weird, how can you toggle ready if you're not in this room?");
                }
                else {
                    this.readyPlayers.set(socket.userID, !ready);
                    const display = this.room.getDisplayID();
                    this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), display);
                    this.room.sendMessage("toggle_ready", !ready, socket.userID);
                    // send current ruleset to the host if they're ready
                    if (socket.userID === this.room.getHostID() && !ready)
                        this.room.sendMessage("select_ruleset", this.ruleset.toString(), socket.userID);
                }
            });
            if (socket.userID === this.room.getHostID()) {
                socket.on("select_ruleset", (data) => {
                    try {
                        let ruleset = Ruleset_1.Ruleset.JSONToRuleset(data);
                        this.ruleset = ruleset;
                    }
                    catch (e) {
                        console.error("That's weird, failed to update ruleset.");
                    }
                });
            }
            this.room.sendMessage("toggle_ready", false, playerID);
            this.room.sendMessage("create", this.room.getInfo(), this.room.getDisplayID());
        });
    }
    goNextState() {
        this.cleanupState();
        this.room.setState(this.nextState);
    }
    setupListeners() {
        this.room.getAllPlayerSockets().then(sockets => {
            let hostID = this.room.getHostID();
            for (const socket of sockets) {
                socket.on("toggle_ready", () => {
                    let ready = this.readyPlayers.get(socket.userID);
                    if (ready === undefined) {
                        console.error("That's super weird, how can you toggle ready if you're not in this room?");
                    }
                    else {
                        this.readyPlayers.set(socket.userID, !ready);
                        this.room.sendMessage("toggle_ready", JSON.stringify(Object.fromEntries(this.readyPlayers)), this.room.getDisplayID());
                        this.room.sendMessage("toggle_ready", !ready, socket.userID);
                        // send current ruleset to the host if they're ready
                        if (socket.userID === hostID && !ready)
                            this.room.sendMessage("select_ruleset", JSON.stringify(this.ruleset), socket.userID);
                    }
                });
                if (socket.userID === hostID) {
                    socket.on("select_ruleset", (data) => {
                        try {
                            let ruleset = Ruleset_1.Ruleset.JSONToRuleset(data);
                            this.ruleset = ruleset;
                        }
                        catch (e) {
                            console.error("That's weird, failed to update ruleset.");
                        }
                    });
                }
            }
        });
    }
    setupReadyMap() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            this.readyPlayers.set(key, false);
        });
    }
    readyToStart() {
        const players = this.room.getPlayers();
        Object.keys(players).forEach((key) => {
            if (!this.readyPlayers.get(key))
                return false;
        });
        this.goNextState();
    }
    cleanupState() {
        this.cleanupListeners();
    }
    cleanupListeners() {
        this.room.getAllPlayerSockets().then(sockets => {
            for (const socket of sockets) {
                socket.off("toggleReady");
            }
        });
    }
}
exports.LobbyRoomState = LobbyRoomState;
