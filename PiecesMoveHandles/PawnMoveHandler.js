import { rows,columns } from "../utilies/constants.js";

const getPawnMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);
    let direction = (turn === "white") ? -1 : 1; // White moves up (-1), Black moves down (1)
    let startRow = (turn === "white") ? 6 : 1; // White starts at row 6, Black starts at row 1

    if (row + direction >= 0 && row + direction < rows.length){
        // Standard one square move
        if (board[row + direction][col] === "") {
            possibleMoves.push(columns[col] + rows[row + direction]);
            
            // Two squares move from start position
            if (row === startRow && board[row + 2 * direction][col] === "") {
                possibleMoves.push(columns[col] + rows[row + 2 * direction]);
            }
        }
    
        // Capturing moves
        if (col > 0 && board[row + direction][col - 1].startsWith(turn === "white" ? "black" : "white")) {
            possibleMoves.push(columns[col - 1] + rows[row + direction]);
        }
        if (col < 7 && board[row + direction][col + 1].startsWith(turn === "white" ? "black" : "white")) {
            possibleMoves.push(columns[col + 1] + rows[row + direction]);
        }

    }

    // console.log(possibleMoves);
    return possibleMoves;
    
}

export default getPawnMoves;