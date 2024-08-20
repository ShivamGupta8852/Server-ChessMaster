import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImage: {
        type: String, // URL of the uploaded profile image
        required: false,
    }
})

const User = mongoose.model('User' ,userSchema);

export default User;