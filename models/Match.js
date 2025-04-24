import mongoose from "mongoose";
import User from './User.js'

const matchSchema = new mongoose.Schema(
  {
    players: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        username: { type: String },
      },
    ],
    result: { type: String, enum: ["win", "loss", "draw"], required: true },
    duration: { type: Number, required: true }, // in seconds
    totalTimeEachPlayer: {
      player1: { type: Number }, // in seconds
      player2: { type: Number }, // in seconds
    },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
