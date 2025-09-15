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
                        let isEaten = board.state && board.state[r] && board.state[r][c];
                        // if(r == 0) isEaten = true;
                        let className = `${isEaten ? "eaten " : ""}${isPoison ? "poison" : ""}`;

                        return (
                            <div
                                key={`${r}-${c}`}
                                className={`cell ${className}`}
                                onClick={() => onCellClick(r, c)}
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