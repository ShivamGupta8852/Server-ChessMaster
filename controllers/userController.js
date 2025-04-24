import User from "../models/User.js";
import bcrypt, { genSalt } from "bcrypt";
import cloudinary from "../utilies/cloudinary.js";
import jwt from "jsonwebtoken";

const handleSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
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

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required...",
      });
    }

    const userexist = await User.findOne({ email });
    if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
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

    const token = jwt.sign(
      { userId: userexist._id, email: userexist.email }, // payload
      process.env.JWT_SECRECT_KEY, // secret key
      {
        expiresIn: "7d", // optional (token expiry)
      }
    );
    
    res.cookie("token", token, {
      httpOnly:true,             // Prevent JavaScript access to the cookie
      secure:true,            // Only set to true in production (when using HTTPS)
      sameSite:"none",        // Allows cross-origin cookies
      expires: new Date(Date.now() + 7*24*60*60*1000),  // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      profileImage: userexist.profileImage,
      userName: userexist.username,
      email: userexist.email,
    });

  } catch (error) {
    console.log("Server login error", error.message);
    return res.status(500).json({
      success: false,
      message: "Server login error",
    });
  }
};

const handleUpdateProfile = async (req, res) => {
  const {userId} = req.user;

  const {currentPassword, newPassword } = req.body;
  console.log("file ", req.file, "file path ", req.file.path);

  try {
    // Check if the user exists
    const userexist = await User.findOne({ _id:userId });

    if (!userexist) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    console.log("userexist");

    let profileImageUrl = null;
    if (req.file) {
      // Upload the new profile image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
        allowed_formats: ["jpg", "jpeg", "png"],
      });
      profileImageUrl = result.secure_url; // Store the secure URL of the image
    }

    console.log("cloudinary correct");

    // Validate current password if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, userexist.password);

      console.log("isPasswordvalid",isPasswordValid);

      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password and profile image URL
      await User.updateOne(
        { _id:userId },
        {
          ...(profileImageUrl && { profileImage: profileImageUrl }), // Update profile image URL if it exists
          password: hashedNewPassword, // Update the password
        }
      );
    } else {
      // If no new password provided, just update the profile image URL if it exists
      if (profileImageUrl) {
        await User.updateOne(
          { _id:userId  },
          {
            profileImage: profileImageUrl,
          }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileImage:profileImageUrl,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const handleLogout = async (req, res) => {
  // clear the token in cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    samesite: "none",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful!",
  });
};

const validateUserSession = async (req,res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ isValid: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRECT_KEY);
    return res.json({ isValid: true });
  } catch (err) {
    console.log("validate-session token error : ",err.message);
    return res.json({ isValid: false });
  }
}

// Fetch top 10 players based on rating
const getLeaderboard = async (req, res) => {
  try {
      const leaderboard = await User.find({})
          .sort({ rating: -1,winCount:-1,lossCount:1 })  // sort by rating,wins, lowest losses
          .limit(10)
          .select('username rating winCount lossCount drawCount profileImage');
          
      res.status(200).json({
        success:true,
        leaderboardData:leaderboard
      });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

// Fetch the logged-in user's profile (username, rating, stats, etc.)
const getUserProfile = async (req, res) => {
  const { userID } = req.user;
  try {
      const user = await User.findById(userID).select('username rating winCount lossCount drawCount profileImage');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' });
  }
};

export { handleSignup, handleLogin, handleUpdateProfile, handleLogout,validateUserSession,getLeaderboard, getUserProfile };
