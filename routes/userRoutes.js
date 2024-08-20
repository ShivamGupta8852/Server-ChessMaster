import express from "express";
import { handleSignup, handleLogin } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post('/signup',upload.single('profileImage'), handleSignup);
router.post('/login', handleLogin);

export default router;