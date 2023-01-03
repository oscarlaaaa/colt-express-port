import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../context/Socket';
import { State } from '../../utils/Enums'
import { Back } from '../../utils/Interfaces';
import LobbyScreenPlayer from './LobbyScreenPlayer';
import { Button } from "react-bootstrap";

const PlayerScreens: React.FC<Back> = ({ back }) => {
    const socket = useContext(SocketContext);
    const [state, setState] = useState<State>(State.Lobby);

    return (
        <>
            <Button onClick={() => back()}>Back</Button>
            {state === State.Lobby && <LobbyScreenPlayer />}
            {state === State.Game && <p>Game</p>}
            {state === State.Results && <p>Results</p>}
        </>
    )
}

export default PlayerScreens