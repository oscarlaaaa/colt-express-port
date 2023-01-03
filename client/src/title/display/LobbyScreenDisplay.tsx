import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../context/Socket";

const LobbyScreenDisplay = () => {
    const socket = useContext(SocketContext);
    const [roomData, setRoomData] = useState<any>(null);

    useEffect(() => {
        console.log("rendered lobby screen display")
        console.log(roomData)

        socket.on('create', (data: any) => {
            console.log(data);
            setRoomData(JSON.parse(data));
            console.log(roomData);
        });

        if (roomData === null)
            socket.emit("create");
            
        return () => {
            socket.off('create');
        };
    }, [roomData]);

    const listItems = roomData?.players.map((person: any) =>
        <li>{person}</li>
    );

    return <div className="titleScreen">
        <button onClick={() => {console.log(roomData); socket.emit("create");}} />
        <h2>Room ID: {roomData?.id}</h2>
        <br/>
        <h2>Host: {roomData?.host}</h2>
        <br/>
        <h2>State: {roomData?.state}</h2>
        <br/>
        <h2>Players:</h2>
        {roomData?.players && listItems}
    </div>;
};

export default LobbyScreenDisplay;
