import { Socket } from "socket.io";

export class PlayerSocket extends Socket {
    public roomID?: string;
    public userID?: string;
    public isHost?: boolean;
    public isDisplay?: boolean;

    constructor(nsp: any, client: any, auth: any) {
        super(nsp, client, auth);
    }
}