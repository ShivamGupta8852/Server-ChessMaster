import { initialGameState } from "../utilies/constants.js";
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  roomID : {
    type : String,
    required : true,
    unique : true
  },
  players:[{
    userID: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['white', 'black'],
      required: true
    }
  }],
  state : {
    board : {
        type: [[String]],
        required : true,
        default : () => {initialGameState}
    },
    turn : {
        type: String,
        enum : ['white','black'],
        required : true,
        default : 'white'
    },
    timers : {
        white:{
            type: Number,
            required:true,
            default:600000
        },
        black:{
            type: Number,
            required:true,
            default:600000
        }
    },
    moveList : {
      type: Array,
      required : true,
      default : []
    },
    currentMoveIndex : {
      type : Number,
      required : true,
      default : -1
    },
    previewBoard : {
      type : [[String]],
      required : true,
      default : () => {initialGameState}
    },
    lastMoveTime : {
      type: Number,
      required: true,
      default : Date.now()
    }
  },
  isAvailableForRandom : {
    type: Boolean,
    required : true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
