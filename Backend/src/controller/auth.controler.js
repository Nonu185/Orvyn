import usermodel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmails } from "../services/mail.servise.js";
import jwt from "jsonwebtoken";

// @desc: Register a new user
// @route: POST /api/auth/register
// @access: Public

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}

    const isAlreadyRegistered = await usermodel.findOne({
      $or: [{ username }, { email }],
    });

    if (isAlreadyRegistered) {
      return res.status(409).json({
        message: "User with this username or email already exists",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
      username,
      email,
      password: hashedPass,
      verified: true, // Auto verify users
    });
    

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// @desc: login user
// @route: POST /api/auth/login
// @access: Public

export async function login(req, res) { 
  try{
    const {email,password,} = req.body;
    if(!email || !password){
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    const user = await usermodel.findOne({email});
    if(!user){
        return res.status(401).json({message:"User not found"});
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({message:"Invalid password"});
    }

    const token = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token,{
      httpOnly:true,
      secure: true,
      sameSite:"none",
      maxAge:24 * 60 * 60 * 1000,
    });


    
    return res.status(200).json({
    message:"Login successful",
    token,
    user:{
      _id:user._id,
      username:user.username,
      email:user.email,
     
    }
})
  }
  catch(error){
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
//@desc: get user profile
//@route : GET /api/auth/getme
//@access : Private

export async function getme(req, res) {
  try {
    const user = await usermodel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
} 

// Removed verifyEmail function as verification is disabled
// @desc: Logout user
// @route: POST /api/auth/logout
// @access: Public
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}