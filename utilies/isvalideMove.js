import isKingInCheck from "../PiecesMoveHandles/isKingInCheck.js";
import { rows,columns } from "./constants.js";

const isvalideMove = (game,piece,from,to) => {
    let fromRow = rows.indexOf(from[1]);
    let fromCol = columns.indexOf(from[0]);
    let toRow = rows.indexOf(to[1]);
    let toCol = columns.indexOf(to[0]);
    let board = game.state.board;
    let turn  = game.state.turn;

    // // temporary change the board
    const capturedPiece = board[toRow][toCol]; 
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = "";

    // isKingInCheck(board,turn);

    if(isKingInCheck(board,turn)){
        //restore the original board if king is in check and return false to show invalid move
        board[toRow][toCol] = capturedPiece;
        board[fromRow][fromCol] = piece;

        game.state.board[fromRow][fromCol] = piece;
        game.state.board[toRow][toCol] = capturedPiece;
        return false;
    }

    game.state.board[toRow][toCol] = piece;
    game.state.board[fromRow][fromCol] = "";

    game.state.previewBoard = game.state.board;
     // update movelist
    //  game.state.moveList = game.state.moveList.slice(0, game.state.currentMoveIndex + 1);
     game.state.moveList.push({ from, to, capturedPiece});
     game.state.currentMoveIndex = game.state.moveList.length - 1;
     game.state.lastMoveTime = Date.now();

    return true;


}

export default isvalideMove;