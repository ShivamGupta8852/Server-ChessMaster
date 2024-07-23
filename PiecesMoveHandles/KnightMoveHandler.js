import { rows,columns } from "../utilies/constants.js";

const getKnightMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);

    // knight 8 possible moves indices(row,col)
    const knightMoves = [
        [-2, -1], [-1, -2], [1, -2], [2, -1],
        [2, 1], [1, 2], [-1, 2], [-2, 1]
    ];

    // Iterate through all 8 possible knight moves
    for (let move of knightMoves) {
        let newRow = row + move[0];
        let newCol = col + move[1];

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {      // if piece is not out of bound
            if (board[newRow][newCol] === "" || board[newRow][newCol].startsWith(turn == "white" ? "black" : "white")) { // if empty or occupied by opponent
                possibleMoves.push(`${columns[newCol]}${rows[newRow]}`);
            }
        }
    }

    // console.log(possibleMoves);
    return possibleMoves;
}

export default getKnightMoves;