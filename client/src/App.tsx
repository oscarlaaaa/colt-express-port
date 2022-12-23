import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


function App() {
    const [socket, setSocket] = useState<any>(null);
    const [isConnected, setIsConnected] = useState<any>(false);
    const [lastPong, setLastPong] = useState<string | null>(null);
    const [data, setData] = useState<string>("");
    const [input, setInput] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on('connect', (data: any) => {
                setIsConnected(true);
            });

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
                setIsConnected(false);
            });

            socket.on('pong', () => {
                setLastPong(new Date().toISOString());
            });
        }
        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('connection');
                socket.off('disconnect');
                socket.off('pong');
            }
        };
    }, [socket]);

    async function connectToSocket() {
        const s = io("ws://localhost:8000");
        setSocket(s);
    }
    
    const connect = () => {
        if (!isConnected) {
            connectToSocket();
        }
    }

    const joinRoom = () => {
        if (isConnected) {
            socket.emit("join", input);
        }
    }

    const createRoom = () => {
        if (isConnected) {
            socket.emit("create");
        }
    }

    const disconnect = () => {
        if (isConnected) {
            socket.disconnect();
        }
    }

    const sendPing = () => {
        socket.emit('ping', { "lets": "go" });
    }

    return (
        <div className="App">
            <div>
                <p>Connected: {'' + isConnected}</p>
                <p>Last pong: {lastPong || '-'}</p>
                <p>Data: {data}</p>
                <button onClick={connect}>Connect</button>
                <button onClick={disconnect}>Disconnect</button>
                <button onClick={sendPing}>Send ping</button>
                <br/>
                <br/>
                <br/>
                
                <input value={input} onInput={e => setInput((e.target as HTMLInputElement).value)}/>
                <button onClick={joinRoom}>Join Room</button>
                <button onClick={createRoom}>Create Room</button>
            </div>
        </div>
    );
}

export default App;
