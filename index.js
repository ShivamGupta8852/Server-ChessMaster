import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {createServer} from 'http';
import { Server } from 'socket.io';
import handleSocketEvents from './socketHandler.js';
import connectDB from './database/connectDB.js';
import { fetchAndStoreNews,scheduleNewsUpdate } from './utilies/fetchAndStoreNews.js';
import newsRoutes from './routes/newsRoutes.js'

const app = express();
app.use(cors({
    // origin : "http://localhost:5173"
    origin : "https://chessmasteronline.netlify.app"
}))

app.use(express.json());

//routes
app.use('/api/news', newsRoutes);


const server = createServer(app);
const io = new Server(server, {
    cors:{
        // origin:["http://localhost:5173"],
        origin:["https://chessmasteronline.netlify.app"],
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