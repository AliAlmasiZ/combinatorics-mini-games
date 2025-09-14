import React from "react";
import "./Board.css";


function Board({board, onCellClick}) {
    let cellNumber = 1;
    return (
        <div id="board" style={{gridTemplateColumns: `repeat(${board.cols}, 50px)`}}>
            {
                Array.from({length : board.rows}).map((_, r) => 
                    Array.from({length: board.cols}).map((_, c) => {
                        const isPoison = r === 0 && c === 0;
                        const isEaten = board.state && board.state[r] && board.state[r][c];
                        let className = `${isEaten ? "eaten " : ""}${isPoison ? "posion" : ""}`;

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={`cell ${className}`}
                                onClick={onCellClick}
                            >
                                {cellNumber++}
                            </div>
                        );
                    })
                )
            }
        </div>
    );
}

export default Board;