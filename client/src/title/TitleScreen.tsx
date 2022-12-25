import { Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/Socket';

const TitleScreen = () => {
    const socket = useContext(SocketContext);
    const [connected, setConnected] = useState<boolean>(socket.connected);
    const [selected, setSelected] = useState<string | null>(null);

    const [data, setData] = useState<string>("");
    const [input, setInput] = useState("");

    useEffect(() => {
        if (connected) {
            socket.on('join', (data: any) => {
                setData(data);
            });

            socket.on('create', (data: any) => {
                setData(data);
            });

            socket.on('disconnect', () => {
                setData("");
                setConnected(false);
                console.log(socket.connected);
                window.sessionStorage.clear();
            });

            socket.on("session", ({ roomID, userID, isHost }: any) => {
                // store it in the localStorage
                window.sessionStorage.setItem("roomID", roomID);
                window.sessionStorage.setItem("userID", userID);
                window.sessionStorage.setItem("isHost", isHost);
                // save the ID of the user
                socket.userID = userID;
                socket.roomID = roomID;
                socket.isHost = isHost;
                console.log("Saved credentials!");
            });
        } else {
            const roomID = window.sessionStorage.getItem("roomID");
            const userID = window.sessionStorage.getItem("userID");
            const isHost = window.sessionStorage.getItem("isHost");

            if (roomID && userID) {
                socket.auth = { roomID, userID, isHost };
                socket.connect();
                socket.emit("join");
            }
            socket.on('connect', () => {
                setConnected(true);
            });
        }
        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('join');
                socket.off('create');
                socket.off('connection');
                socket.off('disconnect');
            }
        };
    }, [connected]);

    return (
        <div>
            {selected && <Button onClick={() => setSelected(null)}>Back</Button>}
            <h1>Colt Express</h1>
            {!selected && <div>
                <Button onClick={() => setSelected("create")}>Create Game</Button>
                <br />
                <Button onClick={() => setSelected("join")}>Join Game</Button></div>}
            {selected === "create" && 
                <div>
                    
                </div>}
            {selected === "join" && <div>join</div>}
        </div>
    )
}

export default TitleScreen