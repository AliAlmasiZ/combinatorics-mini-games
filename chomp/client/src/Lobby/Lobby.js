import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast"
function Lobby({ socket , enterGame }) {
    const [gameIdInput, setGameIdInput] = useState("");
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(6);


    useEffect(() => {
        socket.on("gameCreated", (game) => {            
            enterGame(game);
            toast.success("Game Created!")
        });

        socket.on("joinedGame", (game) => {
            enterGame(game);
            toast.success("joined the game")
        });

        socket.on("error", ({error}) => {
            console.log("error from server:", error);
            toast.error(error);
        })

        return () => {
            socket.off("gameCreated");
            socket.off("error")
        };
    }, []);


    const handleCreateGame = () => {
        if (socket) {
            socket.emit("createGame", { rows, cols });
        }
    };
    
    const handleJoinGame = () => {
        if(!gameIdInput) {
            toast.error("Please enter a Game ID");
            return;
        }
        const gameId = gameIdInput.toUpperCase();
        if(socket) {
            console.log(`joining game ${gameId}`);
            socket.emit("joinGame", gameId);
        }
    };
    
    return (
        <>
            <Toaster position="bottom-left"/>
            <div className="bg-gray-800 text-white flex flex-col items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md mx-auto text-center">
                    <h1 className="text-5xl font-black mb-6">CHOMP ONLINE</h1>
                    <div className="bg-gray-700 p-8 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Create a New Game</h2>
                        <div className="flex gap-4 mb-4">
                            <label className="flex flex-col text-left flex-1">
                            <span className="text-xl mb-1">Rows (m):</span>
                            <input
                                type="number"
                                value={rows}
                                onChange={(e) => setRows(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            />
                            </label>

                            <label className="flex flex-col text-left flex-1">
                            <span className="text-xl mb-1">Columns (n):</span>
                            <input
                                type="number"
                                value={cols}
                                onChange={(e) => setCols(e.target.value)}
                                min="1"
                                max="20"
                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                            />
                            </label>
                        </div>
                        <button
                        onClick={handleCreateGame}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md mb-4"
                        >
                        Create Game
                        </button>

                        <div className="my-6 border-t border-gray-600"></div>

                        <h2 className="text-2xl font-bold mb-4">Join an Existing Game</h2>
                        <input
                        type="text"
                        value={gameIdInput}
                        onChange={(e) => setGameIdInput(e.target.value)}
                        placeholder="Enter Game ID"
                        className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white mb-4"
                        />
                        <button
                        onClick={handleJoinGame}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                        >
                        Join Game
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Lobby;