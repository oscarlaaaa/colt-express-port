import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../context/Socket';

const Lobby = () => {
    const socket = useContext(SocketContext);
    const [connected, setConnected] = useState<boolean>(socket.connected);
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
            socket.auth = { roomID: input }
            socket.emit("join");
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

    return (
        <div>
            <p>Connected: {'' + connected}</p>
            { 
                connected ?
                <div>
                    <p>Data: {data}</p>
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