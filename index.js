import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {createServer} from 'http';
import { Server } from 'socket.io';
import handleSocketEvents from './socketHandler.js';
import connectDB from './database/connectDB.js';
import { fetchAndStoreNews,scheduleNewsUpdate } from './utilies/fetchAndStoreNews.js';
import newsRoutes from './routes/newsRoutes.js'
import userRoutes from './routes/userRoutes.js'
import matchRoutes from './routes/matchRoutes.js';
import friendRoutes from './routes/friendRoutes.js';

const app = express();

app.use(express.json());
app.use(cors({
    credentials: true,   // Allow CORS with credentials (for cookies to work across domains)
    origin : process.env.CLIENT_URL,
}))
app.use(cookieParser());


//routes
app.use('/api/news', newsRoutes);
app.use('/api/user',userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/friends', friendRoutes);


const server = createServer(app);
const io = new Server(server, {
    cors:{
        credentials : true,  // Allow CORS with credentials (for cookies to work across domains)
        origin:process.env.CLIENT_URL,
    }
})

// handle Database(MongoDB) connection
const DATABASE_URL = process.env.DATABASE_URL;

connectDB(DATABASE_URL).then(() => {
    const PORT = process.env.PORT || 8002;
    server.listen(PORT, () => {
        console.log(`server is listening on port : ${PORT}`);
    })
    
    // Fetch news data immediately after the server starts
    fetchAndStoreNews();

    // Schedule the task to update news every hour
    scheduleNewsUpdate();
});

// handle socket
handleSocketEvents(io);