import React, { useEffect } from "react";
import Board from "../Board/Board";
import "./Game.css"


function Game({socket, gameId, playerNum}) {

    const testBoard = {
        state : Array(5).fill(Array(5).fill(0)),
        rows : 5,
        cols : 5
    }

    useEffect(() => {
        socket.on("gameUpdate", () => {

        });

        return () => {
            socket.off("gameUpdate");
        };
    }, [])

    function meow() {
        console.log("meow");
        
    }


    return (
        <>
            <Board board={testBoard} onCellClick={meow} />
        </>
    );
}

export default Game