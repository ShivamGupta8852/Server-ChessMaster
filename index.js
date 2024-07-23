import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {createServer} from 'http';
import { Server } from 'socket.io';
import handleSocketEvents from './socketHandler.js';
import connectDB from './database/connectDB.js';

const app = express();
app.use(cors({
    origin : "https://chessmasteronline.netlify.app"
}))
const server = createServer(app);
const io = new Server(server, {
    cors:{
        origin:["https://chessmasteronline.netlify.app"],
    }
})

// handle Database(MongoDB) connection
const DATABASE_URL = process.env.DATABASE_URL;

// handle socket
handleSocketEvents(io);

connectDB(DATABASE_URL).then(() => {
    const PORT = process.env.PORT || 8002;
    server.listen(PORT, () => {
        console.log(`server is listening on port : ${PORT}`);
    })
});
