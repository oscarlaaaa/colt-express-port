import React, { useState, useEffect, useContext } from 'react';
import { Button } from "react-bootstrap";
import { SocketContext } from '../../context/Socket';
import { Ruleset } from '../../utils/Interfaces';
import EditRuleset from './EditRuleset';

const LobbyScreenPlayer = () => {
    const socket = useContext(SocketContext);
    const [error, setError] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [roomData, setRoomData] = useState<any>(null);
    const [ready, setReady] = useState<boolean | null>(null);
    const [ruleset, setRuleset] = useState<Ruleset | null>(null);
    const [editRuleset, setEditRuleset] = useState<boolean>(false);

    useEffect(() => {
        socket.on('join', (data: any) => {
            console.log(data);
            if (data.status === 200) {
                setRoomData(JSON.stringify(data));
            } else {
                setError("Error in joining a room. Please try again.");
            }
        });

        socket.on('toggle_ready', (data: any) => {
            setReady(data);
        })

        socket.on('select_ruleset', (data: any) => {
            setRuleset(JSON.parse(data));
        })

        return () => {
            socket.off('join');
            socket.off('toggle_ready');
            socket.off('select_ruleset');
        };
    }, [roomData]);

    function findRoom() {
        socket.emit("join", input);
    }

    function toggleReady() {
        setRuleset(null);
        socket.emit("toggle_ready");
    }

    function submitNewRuleset(rules: Ruleset) {
        socket.emit("select_ruleset", rules);
    }

    return (
        <div className="titleScreen">
            {roomData ? 
            <>
                <p>{roomData}</p>
                {ready !== null && !ready && 
                    <Button onClick={() => toggleReady()}>Ready up</Button>
                }
                {ready !== null && ready && 
                    <>
                        <Button onClick={() => toggleReady()}>Not ready</Button>
                        <br/>
                        <br/>
                        {editRuleset ? 
                            <EditRuleset rules={ruleset} submitNewRuleset={submitNewRuleset} finishEditing={() => setEditRuleset(false)} /> 
                            : 
                            <Button onClick={() => setEditRuleset(true)}>Edit Rules</Button>}
                    </>
                }
            </>
            :
            <>
                <h2>Enter the Room ID</h2>
                {error && <p>{error}</p>}
                <input value={input} onInput={e => setInput((e.target as HTMLInputElement).value)} />
                <Button onClick={findRoom}>Join Room</Button>
            </>}
        </div>
    )
}

export default LobbyScreenPlayer