const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {id: user._id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    );
}


//generate refrech token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "7d"}
    );
}

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    hashToken
}