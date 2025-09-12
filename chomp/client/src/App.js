import React, { useState } from "react";
import './App.css';
import Lobby from "./Lobby/Lobby";
import io from "socket.io-client"
import Game from "./Game/Game";

const socket = io("http://localhost:5000")

function App() {
  const [view, setView] = useState("lobby")
  const [currentGameId, setCurrentGameId] = useState(null);
  const [currentPlayerNum, setCurrentPlayerNum] = useState(null);

  const enterGame = (gameId, playerNum) => {
    setCurrentGameId(gameId);
    setCurrentPlayerNum(playerNum);
    setView("game");
  }

  return (
    <>
      {view === "lobby" && <Lobby socket={socket} enterGame={enterGame} />}
      {view === "game" && <Game 
        socket={socket}
        gameId={currentGameId}
        playerNum={currentPlayerNum}
      />}
    </>
  );
}


export default App;
