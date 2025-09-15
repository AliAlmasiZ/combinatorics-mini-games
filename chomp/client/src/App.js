import React, { useEffect, useState } from "react";
import './App.css';
import Lobby from "./Lobby/Lobby";
import io from "socket.io-client"
import Game from "./Game/Game";
const socket = io("http://192.168.1.105:5000");

function App() {
  const [view, setView] = useState("lobby")
  const [game , setGame] = useState(null);

  const enterGame = (game) => {
    setGame(game);
    setView("game");
  }
  return (
    <>
      {view === "lobby" && <Lobby socket={socket} enterGame={enterGame} />}
      {view === "game" && <Game 
        socket={socket}
        initialGame={game}
      />}
    </>
  );
}


export default App;
