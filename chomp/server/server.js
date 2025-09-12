const express = require("express")
const http = require("http")
const cors = require("cors")
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const port = 5000;

const PLAYER_1 = 1;
const PLAYER_2 = 2;

const games = {};


app.use(cors());

app.get("/game", (req, res) => {
    res.status(200).send("Chomp Game Server");
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('createGame', ({ cols, rows }) => {
        const gameId = Math.random().toString(36).substr(2, 6).toUpperCase();
        socket.join(gameId);

        const initialBoardState = Array(rows * cols).fill(0);
        initialBoardState[0] = -1
        games[gameId] = {
            gameId,
            players: { [socket.id]: PLAYER_1 },
            board: {
                boardState: initialBoardState,
                rows: rows,
                cols: cols
            },
            currentPlayer: PLAYER_1,
            isGameOver: false,
        };

        console.log(`Game created with ID: ${gameId} by ${socket.id}`);
        socket.emit('gameCreated', { gameId, playerNum: PLAYER_1 });
    });

    socket.on('joinGame', (gameId) => {
        const game = games[gameId];
        if (game) {
            if (Object.keys(game.players).length < 2 && !game.players[socket.id]) {
                socket.join(gameId);
                game.players[socket.id] = PLAYER_2;
                console.log(`Player ${socket.id} joined game ${gameId}`);
                io.to(gameId).emit('gameUpdate', game);
            } else if (game.players[socket.id]) {
                 socket.join(gameId);
                 socket.emit('gameUpdate', game);
            }
            else {
                socket.emit('error', 'Game is full.');
            }
        } else {
            socket.emit('error', 'Game not found.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const gameId in games) {
            if (games[gameId].players[socket.id]) {
                delete games[gameId];
                io.to(gameId).emit('error', 'Your opponent has disconnected. Game over.');
                console.log(`Game ${gameId} closed due to disconnect.`);
                break;
            }
        }
    });
});



server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})