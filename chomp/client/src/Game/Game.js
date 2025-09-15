import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Board from "../Board/Board";
import "./Game.css"


function Game({socket, initialGame}) {
    const [ game, setGame ] = useState(initialGame);

    useEffect(() => {
        socket.on("gameUpdate", (game) => {
            setGame(game)
        });
        socket.on("error", (error) => {
            console.log("error from server: ", error);
            toast.error(error)
        });

        return () => {
            socket.off("gameUpdate");
            socket.off("error");
        };
    }, [])

    function cellClicked(row, col) {
        socket.emit("cellClick", {row, col})
    }

    function gameStatus() {
        const isPlayerTurn = game.players[socket.id] === game.currentPlayer;
        return game.isGameOver ? `Game Over!  sdasd${isPlayerTurn ? "You Won!" : "You Lost!"}` : isPlayerTurn ? `Your Turn` : `Opponent's Turn`;
    }


    return (
        <>
            <Toaster position="bottom-left" />
            <div className="bg-gray-800 text-white flex flex-col items-center justify-center min-h-screen p-4">
                <button
                onClick={() => {
                    navigator.clipboard.writeText(game.gameId)
                    .then(() => toast.success("Game ID Copied!"))
                    .catch(() => toast.error("Failed to copy Game ID"));
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md mb-4"
                >
                {game.gameId}
                </button>
                <Board board={game.board} onCellClick={cellClicked} />
                <h2 className="text-2xl font-bold mb-4">{gameStatus()}</h2>
            </div>
        </>
    );

}

export default Game