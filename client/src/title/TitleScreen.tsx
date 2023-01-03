import { Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/Socket';
import LobbyScreenDisplay from "./display/LobbyScreenDisplay";
import LobbyScreenPlayer from "./player/LobbyScreenPlayer";


const TitleScreen = () => {
    const socket = useContext(SocketContext);

    const [connected, setConnected] = useState<boolean>(socket.connected);
    const [selected, setSelected] = useState<string | null>(null);

    function delay () {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    useEffect(() => {
        console.log(connected);
        if (connected) {
            socket.on('disconnect', () => {
                setConnected(false);
                window.sessionStorage.clear();
            });

            socket.on("session", ({ roomID, userID, isHost, isDisplay }: any) => {
                // store it in the localStorage
                window.sessionStorage.setItem("roomID", roomID);
                window.sessionStorage.setItem("userID", userID);
                window.sessionStorage.setItem("isHost", isHost);
                window.sessionStorage.setItem("isDisplay", isDisplay);
                // save the ID of the user
                socket.userID = userID;
                socket.roomID = roomID;
                socket.isHost = isHost;
                socket.isDisplay = isDisplay;
                console.log("Saved credentials!");
            });
        } else {
            const roomID = window.sessionStorage.getItem("roomID");
            const userID = window.sessionStorage.getItem("userID");
            const isHost = window.sessionStorage.getItem("isHost");
            const isDisplay = window.sessionStorage.getItem("isDisplay");

            if (roomID && userID) {
                socket.auth = { roomID, userID, isHost, isDisplay };
                socket.connect();
                socket.emit("join", roomID);
            }
            socket.on('connect', () => {
                delay().then(() => {
                    console.log('Fake wait time for connection lets go');
                    setConnected(true);
                });
            });
        }
        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('join');
                socket.off('connection');
                socket.off('disconnect');
            }
        };
    }, [connected]);

    function createRoom () {
        setSelected("create");
        socket.connect();
    }

    function joinRoom () {
        setSelected("join");
        socket.connect();
    }

    function back () {
        setSelected(null);
        socket.disconnect();
    }

    return (
        <div className="titleScreen">
            <h1 className="titleHeader">Colt Express</h1>
            {!selected &&
                <div style={{ width: "100%" }}>
                    <Button onClick={() => createRoom()} className="titleScreenButton">Create Game</Button>
                    <br />
                    <Button onClick={() => joinRoom()} className="titleScreenButton">Join Game</Button>
                </div>}
            {selected &&
                <div>
                    {connected ? <p>connected</p> : <p>connecting</p>}
                    {selected && <Button onClick={() => back()}>Back</Button>}
                    {connected && selected === "create" &&
                        <LobbyScreenDisplay />}
                    {connected && selected === "join" &&
                        <LobbyScreenPlayer />}
                </div>}

        </div>
    )
}

export default TitleScreen