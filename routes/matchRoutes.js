import express from 'express';
import { getMatchHistory, getMatchStats } from '../controllers/matchController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/history',verifyToken, getMatchHistory);
router.get('/stats',verifyToken, getMatchStats);

export default router;
