const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "authorization header missing or malformed"});
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        if(err.name === "TokenExpiredError"){
            return res.status(401).json({ message: "access token expired"});
        }
        return res.status(401).json({message: "invalid access token"});
    }
}

module.exports = authMiddleware;