import findKingPosition from "./findKingPosition.js";
import getPossibleMoves from "../utilies/getPossibleMoves.js";
import { rows,columns } from "../utilies/constants.js";

const isKingInCheck = (board, turn) => {
    let opponentColor = (turn === "white") ? "black" : "white";
    let kingPosition = findKingPosition(board, turn);

    // Check if any opponent's piece can attack the king's position
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] !== "" && board[r][c].startsWith(opponentColor) && !board[r][c].endsWith("king")) {
                let moves = getPossibleMoves(board[r][c], board, `${columns[c]}${rows[r]}`,opponentColor);
                if (moves.includes(kingPosition)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export default isKingInCheck;