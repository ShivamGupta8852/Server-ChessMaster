import express from 'express';
import { getFriendsList, inviteFriend } from '../controllers/friendController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('',verifyToken, getFriendsList);
router.post('/invite',verifyToken, inviteFriend);

export default router;
