import getPawnMoves from '../PiecesMoveHandles/PawnMoveHandler.js';
import getRookMoves from '../PiecesMoveHandles/RookMoveHandler.js';
import getKingMoves from '../PiecesMoveHandles/KingMoveHandler.js';
import getKnightMoves from '../PiecesMoveHandles/KnightMoveHandler.js';
import getBishopMoves from '../PiecesMoveHandles/BishopMoveHandler.js';
import getQueenMoves from '../PiecesMoveHandles/QueenMoveHandler.js';

const getPossibleMoves = (piece,board,position,turn) => {
    const pieceType = piece.split('-')[1];
            // console.log(pieceType);
            let possibleMoves;
            switch (pieceType) {
                case 'pawn':
                 possibleMoves = getPawnMoves(board, position,turn);
                 break;
                case 'rook':
                 possibleMoves = getRookMoves(board, position,turn);
                 break;
                case 'king':
                 possibleMoves = getKingMoves(board, position,turn);
                 break;
                case 'knight':
                 possibleMoves = getKnightMoves(board, position,turn);
                 break;
                case 'bishop':
                 possibleMoves = getBishopMoves(board, position,turn);
                 break;
                case 'queen':
                 possibleMoves = getQueenMoves(board, position,turn);
                 break;          
                default:
                    possibleMoves = [];
                    break;
            }

            return possibleMoves;
}

export default getPossibleMoves;