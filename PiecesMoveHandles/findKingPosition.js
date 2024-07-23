import { rows,columns } from "../utilies/constants.js";

const findKingPosition = (board, turn) => {
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === `${turn}-king`) {
                return `${columns[c]}${rows[r]}`;
            }
        }
    }

    return null;   // it should occur in valid game
}

export default findKingPosition;