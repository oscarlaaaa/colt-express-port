import { createContext } from "react";
import io from "socket.io-client";

export const socket = io("ws://localhost:8000", { autoConnect: false })
export const SocketContext = createContext<any>(null);
