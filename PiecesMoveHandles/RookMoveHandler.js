import { rows,columns } from "../utilies/constants.js";

const getRookMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);
    
    // Rook moves vertically (up)
    for (let r = row - 1; r >= 0; r--) {
        if (board[r][col] === "") {
            possibleMoves.push(columns[col] + rows[r]);
        } else {
            if (board[r][col].includes(turn === "white" ? "black" : "white")) {
                possibleMoves.push(columns[col] + rows[r]);
            }
            break;
        }
    }

    // Rook moves vertically (down)
    for (let r = row + 1; r < 8; r++) {
        if (board[r][col] === "") {
            possibleMoves.push(columns[col] + rows[r]);
        } else {
            if (board[r][col].includes(turn === "white" ? "black" : "white")) {
                possibleMoves.push(columns[col] + rows[r]);
            }
            break;
        }
    }

    // Rook moves horizontally (left)
    for (let c = col - 1; c >= 0; c--) {
        if (board[row][c] === "") {
            possibleMoves.push(columns[c] + rows[row]);
        } else {
            if (board[row][c].includes(turn === "white" ? "black" : "white")) {
                possibleMoves.push(columns[c] + rows[row]);
            }
            break;
        }
    }

    // Rook moves horizontally (right)
    for (let c = col + 1; c < 8; c++) {
        if (board[row][c] === "") {
            possibleMoves.push(columns[c] + rows[row]);
        } else {
            if (board[row][c].includes(turn === "white" ? "black" : "white")) {
                possibleMoves.push(columns[c] + rows[row]);
            }
            break;
        }
    }

    // console.log(possibleMoves);
    return possibleMoves;
}

export default getRookMoves;