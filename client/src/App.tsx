import React, { useState, useEffect, useContext } from 'react';
import {SocketContext, socket} from './context/Socket';
import Lobby from "./lobby/Lobby";


function App() {
    return (
        <div className="App">
            <SocketContext.Provider value={socket}>
                <Lobby />
            </SocketContext.Provider>
        </div>
    );
}

export default App;
