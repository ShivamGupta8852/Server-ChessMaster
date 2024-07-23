import { rows,columns } from "../utilies/constants.js";

const getBishopMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);

    // directions for diagonal movements
    const directions = [
        { row: -1, col: -1 }, // Top-left diagonal
        { row: -1, col: 1 },  // Top-right diagonal
        { row: 1, col: -1 },  // Bottom-left diagonal
        { row: 1, col: 1 }    // Bottom-right diagonal
    ];

    // have to Iterate over each direction
    for (let direction of directions) {
        let i = row + direction.row;
        let j = col + direction.col;

        //continue in current direction till either row or col is out of bound  or opponent encountered
        while (i >= 0 && i < 8 && j >= 0 && j < 8) {
            if (board[i][j] === "") {      // if empty
                possibleMoves.push(`${columns[j]}${rows[i]}`);
            } else {          // if not empty, add opponent in possiblemoves and stop;
                if (board[i][j].startsWith(turn == "white" ? "black" : "white")) {
                    possibleMoves.push(`${columns[j]}${rows[i]}`);
                }
                break; 
            }
            i += direction.row;
            j += direction.col;
        }
    }

    // console.log(possibleMoves);

    return possibleMoves;


}

export default getBishopMoves;