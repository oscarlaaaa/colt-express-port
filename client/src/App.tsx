import React, { useState, useEffect, useContext } from 'react';
import {SocketContext, socket} from './context/Socket';
import Lobby from "./lobby/Lobby";
import TitleScreen from './title/TitleScreen';
import "./styles/App.css";


const App = () => {
    return (
        <SocketContext.Provider value={socket}>
            <div className="App">
                <TitleScreen />
            </div>
        </SocketContext.Provider>
    );
}

export default App;
