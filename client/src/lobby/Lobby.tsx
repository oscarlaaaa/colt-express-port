import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/Socket';

const Lobby = () => {
    const socket = useContext(SocketContext);
    const [connected, setConnected] = useState<boolean>(socket.connected);
    const [lastPong, setLastPong] = useState<string | null>(null);
    const [data, setData] = useState<string>("");
    const [input, setInput] = useState("");

    useEffect(() => {
        console.log(connected);
        if (connected) {
            socket.on('join', (data: any) => {
                setData(data);
                console.log(data);
            });

            socket.on('create', (data: any) => {
                setData(data);
                console.log(data);
            });

            socket.on('disconnect', () => {
                setData("");
                setConnected(false);
                console.log(socket.connected);
                window.sessionStorage.clear();
            });

            socket.on('pong', () => {
                setLastPong(new Date().toISOString());
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
                console.log("we were in already!");
                socket.auth = { roomID, userID, isHost };
                socket.connect();
                if (isHost) {
                    socket.emit("join", roomID);
                }
            }
            socket.on('connect', () => {
                setConnected(true);
                console.log(connected);
            });
        }
        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('join');
                socket.off('create');
                socket.off('connection');
                socket.off('disconnect');
                socket.off('pong');
            }
        };
    }, [connected]);


    const connect = () => {
        if (!socket.connected) {
            socket.connect();
        }
    }

    const joinRoom = () => {
        if (socket.connected) {
            socket.emit("join", input);
        }
    }

    const createRoom = () => {
        if (socket.connected) {
            socket.emit("create");
        }
    }

    const disconnect = () => {
        if (socket.connected) {
            socket.disconnect();
        }
    }

    const sendPing = () => {
        socket.emit('ping', { "lets": "go" });
    }

    return (
        <div>
            <p>Connected: {'' + connected}</p>
            { 
                connected ?
                <div>
                    <p>Last pong: {lastPong || '-'}</p>
                    <p>Data: {data}</p>
                    <button onClick={sendPing}>Send ping</button>
                    <br />
                    <br />
                    <br />
                    <input value={input} onInput={e => setInput((e.target as HTMLInputElement).value)} />
                    <button onClick={joinRoom}>Join Room</button>
                    <button onClick={createRoom}>Create Room</button> 
                </div>
                : 
                <div>
                <p>sadge</p>
                <button onClick={connect}>Connect</button>
                </div>
            }
            <button onClick={disconnect}>Disconnect</button>
        </div>
    )
}

export default Lobby