import User from "../models/User.js";
import bcrypt, { genSalt } from "bcrypt";
import cloudinary from "../utilies/cloudinary.js";
import jwt from 'jsonwebtoken';

const handleSignup = async (req, res) => {
  try {
    console.log("hello");
    const { username, email, password } = req.body;
    console.log(username, email, password);
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "complete all required fields",
        success: false,
      });
    }

    // if user with given email already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    // Handle profile image upload
    let profileImageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
        allowed_formats: ["jpg", "jpeg", "png"],
      });
      profileImageUrl = result.secure_url; // Store the secure URL of the image
    }

    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);
    const newuser = await User.create({
      username,
      email,
      password: hasedPassword,
      profileImage: profileImageUrl,
    });
    newuser.save();
    return res.status(200).json({
      success: true,
      message: "Registration done successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in creating new user", success: false });
  }
};

const handleLogin = async(req,res) => {
  try {
      const {email,password} = req.body;
      if(!(email && password)){
          return res.status(400).json({
              success:false,
              message:"All fileds are required...",
          })
      }

      const userexist = await User.findOne({ email });
      if (!userexist) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }
  
      // Check if the password is valid
      const isPasswordValid = await bcrypt.compare(password, userexist.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
  
      const token = await jwt.sign({userId:userexist._id,email:userexist.email},process.env.JWT_SECRECT_KEY,{
          expiresIn:"7d",
      })
      res.cookie("token",token,{
          expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly : true,
          samesite: 'strict',
          secure: true,
      });
      return res.status(200).json({
          success:true,
          message:"Login successfully",
      })
      
  } catch (error) {
      console.log("Server login error",error.message);
      return res.status(500).json({
        success: false,
        message: "Server login error",
      });
  
  }
}

export { handleSignup , handleLogin};
