import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Board from "../Board/Board";
import "./Game.css"


function Game({socket, initialGame}) {
    const [ board, setBoard ] = useState(initialGame.board);
    const gameId = initialGame.gameId;

    useEffect(() => {
        socket.on("gameUpdate", (game) => {
            setBoard(game.board)
        });
        socket.on("error", ({error}) => {
            toast.error(error)
        });

        return () => {
            socket.off("gameUpdate");
            socket.off("error");
        };
    }, [])

    function cellClicked(row, col) {
        console.log(`user clicked on cell in row(${row}) and col(${col})`)
        socket.emit("cellClick", {row, col})
    }


    return (
        <>
            <Toaster position="bottom-left" />
            <button
            onClick={() => {
                navigator.clipboard.writeText(gameId)
                .then(() => toast.success("Game ID Copied!"))
                .catch(() => toast.error("Failed to copy Game ID"));
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md mb-4"
            >
            {gameId}
            </button>
            <Board board={board} onCellClick={cellClicked} />
        </>
    );
}

export default Game