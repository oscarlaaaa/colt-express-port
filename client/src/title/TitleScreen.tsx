import { Button } from "react-bootstrap";
import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/Socket';

const TitleScreen = () => {
    const socket = useContext(SocketContext);

    const [connected, setConnected] = useState<boolean>(socket.connected);
    const [selected, setSelected] = useState<string | null>(null);
    const [data, setData] = useState<string>("");
    const [input, setInput] = useState("");

    function delay() {
        return new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    useEffect(() => {
        console.log(connected);
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
                socket.off('create');
                socket.off('connection');
                socket.off('disconnect');
            }
        };
    }, [connected]);

    function createRoom() {
        setSelected("create");
        socket.connect();
    }

    function back() {
        setSelected(null);
        socket.disconnect();
    }

    return (
        <div className="titleScreen">
            <h1 className="titleHeader">Colt Express</h1>
            {!selected && 
                <div style={{width: "100%"}}>
                    <Button onClick={() => createRoom()} className="titleScreenButton">Create Game</Button>
                    <br />
                    <Button onClick={() => setSelected("join")} className="titleScreenButton">Join Game</Button>
                </div>}
            {selected && 
                <div>
                    {connected ? <p>connected</p> : <p>connecting</p>}
                    {selected && <Button onClick={() => back()}>Back</Button>}
                    {selected === "create" && 
                        <div>

                        </div>}
                    {selected === "join" && 
                        <div>

                        </div>}
                </div>}
            
        </div>
    )
}

export default TitleScreen