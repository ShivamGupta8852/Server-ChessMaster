import { v4 as uuidv4 } from 'uuid';
import Game from './models/Game.js';
import { columns, initialGameState, rows } from './utilies/constants.js';
import getPossibleMoves from './utilies/getPossibleMoves.js';
import isvalideMove from './utilies/isvalideMove.js';
import findKingPosition from './PiecesMoveHandles/findKingPosition.js';

export default async function handleSocketEvents(io){
    const games = new Map();

    const loadGamesFromDatabase = async () => {
        const dbGames = await Game.find();
        dbGames.forEach(game => {
          games.set(game.roomID, game);
        });
    };

    await loadGamesFromDatabase();


    io.on('connection', (socket) =>{
        console.log(`user connected ${socket.id}`);

        // join a room and wait
        const joinRoomAndWait = async (roomID,socket,isAvailableForRandom) => {
            const newGame = new Game({
                roomID,
                players: [{ userID: socket.userID, role: 'white' }],
                state: {
                  board: initialGameState(),
                  turn: 'white',
                  timers: { white: 600000, black: 600000 },
                  moveList:[],
                  currentMoveIndex: -1,
                  previewBoard : initialGameState(),
                  lastMoveTime: Date.now(),
                },
                isAvailableForRandom,
                createdAt: new Date(),
            })
            games.set(roomID,newGame);
            await newGame.save();
            socket.join(roomID);
            socket.emit('waiting');
        }

        // join the room and both players start the game
        const joinRoomAndPlay = async (roomID,socket,game) => {
            game.players.push({ userID: socket.userID, role: 'black' });
            game.state.lastMoveTime = Date.now() + 3;
            games.set(roomID, game);
            await Game.updateOne({ roomID }, {players : game.players});
            socket.join(roomID);
            io.to(roomID).emit('startGame', roomID);
        }

        //create or find room when clicked on Play online(client side)
        socket.on('findOrCreateRoom', (userID) => {
            socket.userID = userID;
            let roomID = null;      // to return roomId of room joined to socket
            for(let [id,game] of games.entries()){
                if(game.players.length === 1 && game.isAvailableForRandom){
                    roomID = id;
                    joinRoomAndPlay(roomID,socket,game);
                    break;
                }
            }

            // if not single player room found, then create new room with initial states
            if(!roomID){
                roomID = uuidv4();
                joinRoomAndWait(roomID,socket,true);
            }
            console.log("Play online clicked");
        })

        // create and join the specified room when Clicked on Invite friend
        socket.on('joinSpecificRoom', async ({ roomID, userID }) => {
            socket.userID = userID;
            let game = games.get(roomID) || await Game.findOne({roomID});

            if(game && game.players.length === 2){
                socket.emit('roomfull');
            }
            if(game && game.players.length === 1 && game.roomID == roomID){
                joinRoomAndPlay(roomID,socket,game);
            }
            if(!game){
                joinRoomAndWait(roomID,socket,false);  //isAVailableForRandom == false to Mark room as unavailable for random matchmaking
            }
        })

        // handle the browser refresh
        socket.on('joinGame', async ({ roomID, userID }) => {
            socket.userID = userID;
            const currentTime = Date.now();
            let game = games.get(roomID) || await Game.findOne({ roomID });
            if (game) {
                const lastMoveTime = await game.state.lastMoveTime;
                const player = game.players.find(player => player.userID === userID);
                if (!player) {
                    const existingRole = game.players[0].role;
                    const newRole = existingRole === 'black' ? 'white' : 'black';
                    game.players.push({ userID, role: newRole });

                }
                const elapsedTime = currentTime - lastMoveTime;
                game.state.timers[game.state.turn] -= elapsedTime;
                game.state.lastMoveTime = currentTime;

                socket.join(roomID);
                io.to(roomID).emit("UpdateGame", game);

                // update the game
                games.set(roomID, game);
                await Game.updateOne({ roomID }, { $set: { 'state': game.state } });
            }
        });

        // return all possible moves of a piece 
        socket.on('getPossibleMoves', async (roomID, piece, position) =>{
            const game = games.get(roomID)  || await Game.findOne({roomID});
            if(game){
                if(game.state.currentMoveIndex !=  game.state.moveList.length - 1){
                    socket.emit('updateBoard', game.state.board);
                    game.state.previewBoard = game.state.board;
                    game.state.currentMoveIndex = game.state.moveList.length - 1;
                }else{
                    let possibleMoves = getPossibleMoves(piece,game.state.board,position,game.state.turn);
                    socket.emit("possibleMoves",possibleMoves);
                    socket.broadcast.to(roomID).emit("opponentSelectedPiece", position);
                }
            }
        })

        // validate the move of a piece
        socket.on("validateMove", async ({roomID, piece,from,to}) => {
            const currentTime = Date.now();
            const game = games.get(roomID) || await Game.findOne({roomID});
            const lastMoveTime = await (game.state.lastMoveTime);
            if(game){
                if(game.state.currentMoveIndex !=  game.state.moveList.length - 1){
                    socket.emit('updateBoard', game.state.board);
                    game.state.previewBoard = game.state.board;
                    game.state.currentMoveIndex = game.state.moveList.length - 1;
                    // JSON.stringify(game.state.board) !== JSON.stringify(game.state.previewBoard)
                }
                else{
                    if(isvalideMove(game,piece,from,to)){

                        const elapsedTime = currentTime - lastMoveTime;
                        game.state.timers[game.state.turn] -= elapsedTime;
                        game.state.turn =  game.state.turn == "white" ? "black" : "white"; // switch the turn if valide move
                        io.to(roomID).emit('moved', game);
                        socket.broadcast.to(roomID).emit('opponentSelectedPiece', to);
                        const endtime = Date.now();
                        console.log("time taken to make a move : " + ( endtime - currentTime));
    
                        games.set(roomID, game);
                        await Game.updateOne({ roomID }, { $set: { 'state': game.state } });
                    }
                    else{
                        const kingPosition = findKingPosition(game.state.board, game.state.turn);     // is inValid Move(i.e, king of current player is in check);
                        socket.emit("check",game,kingPosition);
                    }
                }

            }
        })

        socket.on('undo' , async ({roomID}) => {
            const game = games.get(roomID) || await Game.findOne({roomID});
            if(game && game.state.currentMoveIndex >= 0){
                const {from,to,capturedPiece} = game.state.moveList[game.state.currentMoveIndex];
                let fromRow = rows.indexOf(from[1]);
                let fromCol = columns.indexOf(from[0]);
                let toRow = rows.indexOf(to[1]);
                let toCol = columns.indexOf(to[0]);
                const fromPiece = game.state.previewBoard[toRow][toCol];
                game.state.previewBoard[toRow][toCol] = capturedPiece;
                game.state.previewBoard[fromRow][fromCol] = fromPiece;
                game.state.currentMoveIndex--;

                games.set(roomID, game);
                await Game.updateOne({ roomID }, { $set: { 'state': game.state } });

                socket.emit('updateBoard',game.state.previewBoard);
                
            }
        })

        socket.on('redo' , async ({roomID}) => {
            const game = games.get(roomID) || await Game.findOne({roomID});
            if(game && game.state.currentMoveIndex < game.state.moveList.length - 1){

                const {from,to,capturedPiece} = game.state.moveList[game.state.currentMoveIndex + 1];
                let fromRow = rows.indexOf(from[1]);
                let fromCol = columns.indexOf(from[0]);
                let toRow = rows.indexOf(to[1]);
                let toCol = columns.indexOf(to[0]);
                
                const toPiece = game.state.previewBoard[fromRow][fromCol];
                game.state.previewBoard[toRow][toCol] = toPiece;
                game.state.previewBoard[fromRow][fromCol] = '';
                game.state.currentMoveIndex++;

                games.set(roomID, game);
                await Game.updateOne({ roomID }, { $set: { 'state': game.state } });

                socket.emit('updateBoard',game.state.previewBoard);
                
            }
        })

        socket.on('beginning', async ({roomID}) => {
            const game = games.get(roomID) || await Game.findOne({roomID});
            if(game){
                const initialboard = initialGameState();
                socket.emit('updateBoard', initialboard);
                game.state.previewBoard = initialboard;
                game.state.currentMoveIndex = -1; 
            }
        })
        
        socket.on('ending', async ({roomID}) => {
            const game = games.get(roomID) || await Game.findOne({roomID});
            if(game){
                socket.emit('updateBoard', game.state.board);
                game.state.previewBoard = game.state.board
                game.state.currentMoveIndex = game.state.moveList.length -1;
            }
        })


        // delete the roomID created with this socket on click of cancel button
        socket.on("cancelSearch", async (userID ) => {
            for (const [id, game] of games){
                const player = game.players.find(player => player.userID === userID)
                if(player){
                    games.delete(id);
                    await Game.deleteOne({roomID : id});
                    break;
                }
            }
        })

        // disconnect the socket
        socket.on('disconnect', async () => {
            console.log('user disconnected:', socket.id);
            for (const [id, game] of games) {
              const playerIndex = game.players.findIndex(player => player.userID === socket.userID);
              console.log(playerIndex);
              if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                console.log("players", game.players.length);
                if (game.players.length === 0) {
                  games.delete(id);
                  await Game.deleteOne({ roomID: id });
                } else {
                  games.set(id, game);
                  await Game.updateOne({ roomID: id },{ $set: { 'players': game.players } });
                }
                break;
              }
            }
        })
    })

}