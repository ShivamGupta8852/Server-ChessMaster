import mongoose from "mongoose";
import { Error } from "mongoose";

const options = {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
  };

const connectDB = async (DATABASE_URL) => {
    try {
        await mongoose.connect(DATABASE_URL,options);
        console.log("MongoDB connected successfully !!");
    } catch (error) {
        console.log(error);
        throw new Error("could not coonect to database")
    }
}

export default connectDB;