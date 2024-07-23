import { rows,columns } from "../utilies/constants.js";
import isKingInCheck from "./isKingInCheck.js";

const getKingMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);

    const directions = [   // 8 possible moves of king
        [-1, -1], [-1, 0], [-1, 1], [0, -1],
         [0, 1], [1, -1], [1, 0], [1, 1]
    ];

    // Iterate through all possible directions
    for (let dir of directions) {
        let newRow = row + dir[0];
        let newCol = col + dir[1];

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (board[newRow][newCol] === "" || board[newRow][newCol].startsWith(turn === "white" ? "black" : "white")) {
                
                let isMoveValid = true; 

                // temporary change the board with king in new Position
                let originalPiece = board[newRow][newCol]; 
                board[newRow][newCol] = board[row][col];
                board[row][col] = "";

                // Check if the king is in check after the move
                if (isKingInCheck(board, turn)) {
                    isMoveValid = false;
                }

                // Restore the board to its original state
                board[row][col] = board[newRow][newCol];
                board[newRow][newCol] = originalPiece;

                // If the move doesn't place the king in check, add it to possible moves
                if (isMoveValid) {
                    possibleMoves.push(`${columns[newCol]}${rows[newRow]}`);
                }
            }
        }
    }

    // console.log(possibleMoves);

    return possibleMoves;

}

export default getKingMoves;