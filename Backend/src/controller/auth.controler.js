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
    });

    const emailtoken = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10m"});
    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${emailtoken}`;

await sendEmails(
  email,
  "Verify your email",
  `<p>Welcome to Orvyn ${username}</p>
   <p>Verify your email to continue</p>
   <p><a href="${verificationLink}">Click on the link to verify your email</a></p>`,
  `Verify your email: ${verificationLink}`
);
      
    

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
    if (!user.verified) {
    return res.status(403).json({
        message: "Please verify your email first"
    });
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

// 
//@desc:Verify email
//@route: GET /api/auth/verify-email
//@access: Public

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    const frontendUrl = process.env.FRONTEND_URL || "https://orvyn-ochre.vercel.app";

    if (!token) {
      return res.redirect(`${frontendUrl}/invalid-link`);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usermodel.findById(decoded.id);

    if (!user) {
      return res.redirect(`${frontendUrl}/invalid-link`);
    }

    if (user.verified) {
      return res.redirect(`${frontendUrl}/already-verified`);
    }

    user.verified = true;
    await user.save();

    return res.redirect(`${frontendUrl}/email-verified`);

  } catch (error) {
    const frontendUrl = process.env.FRONTEND_URL || "https://orvyn-ochre.vercel.app";

    if (error.name === "TokenExpiredError") {
      return res.redirect(`${frontendUrl}/link-expired`);
    }

    if (error.name === "JsonWebTokenError") {
      return res.redirect(`${frontendUrl}/invalid-link`);
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

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