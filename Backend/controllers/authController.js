const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utility/token");
const tokenModel = require("../models/tokenModel");
const { hashToken } = require("../utility/token");


// register controller
const register = async (req, res) => {
    try{
        const {email , password} = req.body;

        // Validation of email
        if(!email.includes('@')){
            return res.status(400).json({message: "Please enter a valid email."})
        }

        const beforeAt = email.split('@')[0];

        if(beforeAt.length < 64){
            return res.status(400).json({message: "Email is not Valid."})
        }

        if(password.length < 8){
            return res.status(400).json({message: "Password should be the combination of at least 8 characters,numbers & special characters."})
        }
        if(!/[A-Z]/.test(password)){
            return res.status(400).json({message: "password needs an uppercase letter."})
        }
        if(!/[a-z]/.test(password)){
            return res.status(400).json({message: "password needs a lowercase letter."})
        }
        if(!/[0-9]/.test(password)){
            return res.status(400).json({message: "password needs a number."})
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return res.status(400).send("Password needs a special character");
        }
        if(!email || !password){
            return res.status(400).json({message: "email and password are required"});
        }

        
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "user already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "user registered successfully",
            userID: newUser._id
        });

    }catch(err){
        res.status(500).json({message: "internal server error"});
    }
}

//login controller
const login = async (req, res) => {
    try{
        const { email , password } = req.body;

        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({ message: "invalid credentials"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "invalid credentials"});
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await tokenModel.create({
            userId: user._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ 
            message: "login successful",
            accessToken: accessToken
        });
    }catch(err){
        res.status(500).json({message: "internal server error"});
    }
}

//refresh token controller
const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Step 1 — Verify the signature + expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Step 2 — Check if this token actually exists in DB (not revoked)
    const storedToken = await tokenModel.findOne({
      userId: decoded.id,
      tokenHash: hashToken(token),
    });

    if (!storedToken) {
      // Token was valid JWT but NOT in DB = reuse attack
      // Nuke ALL sessions for this user as a safety measure
      await tokenModel.deleteMany({ userId: decoded.id });
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "Token reuse detected. Please log in again." });
    }

    // Step 3 — Rotate: delete old token, issue a fresh pair
    await tokenModel.deleteOne({ _id: storedToken._id });

    const newAccessToken  = generateAccessToken({ _id: decoded.id });
    const newRefreshToken = generateRefreshToken({ _id: decoded.id });

    // Save new hashed refresh token
    await tokenModel.create({
      userId: decoded.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Rotate cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
    try{
        const token = req.cookies.refreshToken;

        if(token){
            await tokenModel.deleteOne({ tokenHash: hashToken(token)});
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({ message: "logout successful"});

    }catch(err){
        console.error("Logout error: ", err);
        return res.status(500).json({ message: "internal server error"});
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
}