import isKingInCheck from "../PiecesMoveHandles/isKingInCheck.js";
import { columns, rows } from "./constants.js";
import getPossibleMoves from "./getPossibleMoves.js";

const isCheckMate = (board, turn) => {
  if (!isKingInCheck(board, turn)) {
    return false; // Not checkmate if the king is not in check
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] !== "" && board[r][c].startsWith(turn)) {
        const piece = board[r][c];
        let possibleMoves = getPossibleMoves(piece,board,`${columns[c]}${rows[r]}`,turn);

        // Check each move to see if it can get the king out of check
        for (let move of possibleMoves) {
          let toRow = rows.indexOf(move[1]);
          let toCol = columns.indexOf(move[0]);

          // Temporary move the piece to the new position
          let originalPiece = board[toRow][toCol];
          board[toRow][toCol] = piece;
          board[r][c] = "";

          // Check if the move resolves the check
          if (!isKingInCheck(board, turn)) {
            // // Restore the board to its original state
            board[r][c] = board[toRow][toCol];
            board[toRow][toCol] = originalPiece;
            return false; // as this move can resolve check so noy a checkmate
          }

          // Restore the board to its original state
          board[r][c] = board[toRow][toCol];
          board[toRow][toCol] = originalPiece;
        }
      }
    }
  }

  // no valid move to remove check, so checkmate
  return true;
};

export default isCheckMate;
