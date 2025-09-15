const express = require("express")
const http = require("http")
const cors = require("cors")
const socketIO = require("socket.io");
const { log, error } = require("console");

const app = express();
const server = http.createServer(app)
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const port = 5000;

const PLAYER_1 = 1;
const PLAYER_2 = 2;

const games = {};
const users = {};

function eatCell(row, col, board) {
    for(let i = row; i < board.rows; i++) {
        for(let j = col; j < board.cols; j++) {
            board.state[i][j] = 1;
        }
    }
}

app.use(cors());

app.get("/game", (req, res) => {
    res.status(200).send("Chomp Game Server");
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    users[socket.id] = {
        activeGameId: null
    }

    socket.on('createGame', ({ cols, rows }) => {
        const gameId = Math.random().toString(36).substr(2, 6).toUpperCase();
        socket.join(gameId);
        users[socket.id].activeGameId = gameId;

        const initialBoardState = Array.from({length : rows}, () => Array(cols).fill(0))
        games[gameId] = {
            gameId,
            players: { [socket.id]: PLAYER_1 },
            board: {
                state: initialBoardState,
                rows: rows,
                cols: cols
            },
            currentPlayer: PLAYER_1,
            isGameOver: false,
        };

        log(`Game created with ID: ${gameId} by ${socket.id}`);
        socket.emit('gameCreated', games[gameId]);
    });

    socket.on('joinGame', (gameId) => {
        const game = games[gameId];
        
        if (game) {
            if (Object.keys(game.players).length < 2 && !game.players[socket.id]) {
                socket.join(gameId);
                users[socket.id].activeGameId = gameId;
                game.players[socket.id] = PLAYER_2;
                log(`Player ${socket.id} joined game ${gameId}`);
                socket.emit("joinedGame", game)
                io.to(gameId).emit('gameUpdate', game);
            } else if (game.players[socket.id]) {
                socket.join(gameId);
                users[socket.id].activeGameId = gameId;
                socket.emit('gameUpdate', game);
            }
            else {
                socket.emit('error', 'Game is full.');
            }
        } else {
            socket.emit('error', 'Game not found.');
        }
    });

    socket.on("cellClick", ({row, col}) => {
        const gameId = users[socket.id].activeGameId;
        const game = games[gameId];
        if(!game || game.isGameOver) return;
        if(game.currentPlayer !== game.players[socket.id]) {
            socket.emit('error', "Its not your turn!");
            return;
        }
        if(game.board.state[row, col] === 1) {
            socket.emit('error', "This piece is already eaten!");
            return;
        }
        game.currentPlayer = game.currentPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        game.isGameOver = row === 0 && col === 0;

        try {
            eatCell(row, col, game.board);
        } catch(e) {
            log("error in eating")
            socket.emit('error', e)
        }
        io.to(gameId).emit('gameUpdate', game);
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


process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdin.on("data", (input) => {
    input = input.trim();
    words = input.split(" ")
    if(words[0].trim() == "get-board") {
        const game = games[words[1].trim()];
        for(let i = 0; i < game.board.rows; i++) {
            for(let j = 0; j < game.board.cols; j++) {
                process.stdout.write(`${game.board.state[i][j]} `)
            }
            process.stdout.write('\n')
        }
    }
})