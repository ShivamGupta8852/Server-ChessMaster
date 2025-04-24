import mongoose from "mongoose";
import Match from "../models/Match.js";
import User from "../models/User.js";

// Fetch the match history of the logged-in user
const getMatchHistory = async (req, res) => {
    const { userId } = req.user;

    try {
        const user = await User.findById(userId);
        const username = user.username;
        const matches = await Match.find({'players.username' : username})
            .sort({ createdAt: -1 })
            .populate('players.username', 'username')
            .select('players result duration totalTimeEachPlayer createdAt');

            console.log("matches",matches.length)
        res.status(200).json({
            success:true,
            matchesHistoryData:matches,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching match history' });
    }
};

// Fetch match statistics (wins, losses, draws)
const getMatchStats = async (req, res) => {
    const { userId } = req.user;
    try {
        const user = await User.findById(userId).select('rating winCount lossCount drawCount matchesPlayed');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate player rank
        const allPlayers = await User.find().sort({ rating: -1 });
        const playerRank = allPlayers.findIndex(player => player._id.toString() === userId) + 1;

        res.status(200).json({
            success:true,
            rating:user.rating,
            wins: user.winCount,
            losses: user.lossCount,
            draws: user.drawCount,
            totalMatches: user.matchesPlayed,
            rank: playerRank,
            totalPlayers: allPlayers.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching match statistics' });
    }
};


export {getMatchHistory,getMatchStats};