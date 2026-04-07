const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utility/token");


// register controller
const register = async (req, res) => {
    try{
        const {email , password} = req.body;

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

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
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
const refresh = (req, res) => {
    const token = req.cookies.refreshToken;

    if(!token){
        return res.status(401).json({message: "no token provided"});
    }
    try{
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;

        const newAccessToken = generateAccessToken({ _id: userId});
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: "invalid token" });
    }
}

module.exports = {
    register,
    login,
    refresh
}