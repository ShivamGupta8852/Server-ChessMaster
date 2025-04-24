import express from "express";
import { handleSignup, handleLogin, handleLogout, validateUserSession, handleUpdateProfile, getLeaderboard, getUserProfile } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post('/signup',upload.single('profileImage'), handleSignup);
router.post('/login', handleLogin);
router.get('/logout', handleLogout);
router.get('/leaderboard',verifyToken,getLeaderboard);
router.get('/profile',verifyToken,getUserProfile);
router.patch('/edit-profile',verifyToken,upload.single('newProfileImage'), handleUpdateProfile);
router.get('/validate-session', validateUserSession);

export default router;