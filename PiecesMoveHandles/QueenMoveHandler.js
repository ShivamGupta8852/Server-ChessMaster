import { rows,columns } from "../utilies/constants.js";

const getQueenMoves = (board,position,turn) => {
    let possibleMoves = [];
    let row = rows.indexOf(position[1]);
    let col = columns.indexOf(position[0]);


    const directions = [  
        [-1, 0], [1, 0], [0, -1], [0, 1], // vertical and horizontal
        [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonal
    ];

    // Iterate in all directions
    for (let dir of directions) {
        let [dx, dy] = dir;
        let r = row + dx;
        let c = col + dy;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) { // if indices within bound
            if (board[r][c] === "") {   // if empty
                possibleMoves.push(`${columns[c]}${rows[r]}`);
            } else {  // if opponent encountered then add and stop
                if (board[r][c].startsWith(turn === "white" ? "black" : "white")) {
                    possibleMoves.push(`${columns[c]}${rows[r]}`);
                }
                break;
            }
            r += dx;
            c += dy;
        }
    }

    // console.log(possibleMoves);
    return possibleMoves;

}

export default getQueenMoves;