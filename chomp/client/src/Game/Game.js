import React, { useEffect } from "react";


function Game({socket, gameId, playerNum}) {


    useEffect(() => {
        socket.on("gameUpdate", () => {

        });

        return () => {
            socket.off("gameUpdate");
        };
    }, [])


    return (
        <>
            <h1>TODO</h1>
        </>
    );
}

export default Game