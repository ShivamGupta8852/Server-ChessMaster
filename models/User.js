import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // URL of the uploaded profile image
      required: false,
    },
    rating: {
      type: Number,
      default: 1200, // Initial rating
    },
    winCount: {
      type: Number,
      default: 0,
    },
    lossCount: {
      type: Number,
      default: 0,
    },
    drawCount: {
      type: Number,
      default: 0,
    },
    matchesPlayed: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
