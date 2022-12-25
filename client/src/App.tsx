import React, { useState, useEffect, useContext } from 'react';
import {SocketContext, socket} from './context/Socket';
import Lobby from "./lobby/Lobby";
import TitleScreen from './title/TitleScreen';


const App = () => {
    return (
        <div className="App">
            <SocketContext.Provider value={socket}>
                <TitleScreen />
            </SocketContext.Provider>
        </div>
    );
}

export default App;
