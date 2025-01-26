const User = require('../models/user.model.js'); // CommonJS syntax
const jwt = require('jsonwebtoken');

const verifyJWT = async (req,res, next) => {
    try {
        console.log("Verifying JWT...");
        
        // Extract the token from cookies or Authorization header
        console.log('juop',req.cookies);
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            console.log("401 Unauthorized request - No token provided");
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        // Verify the token using the secret
        console.log("token",token);
       const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
        
        if (!decodedToken) {
            console.log("401 Unauthorized - Token could not be decoded");
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        // console.log("hope",decodedToken._id);
        // Find the user and exclude sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            console.log("401 Invalid Access Token - User not found");
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        
        // Attach user info to the request object
        req.user = user;
        console.log("User verified:", req.user);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.log("401 Invalid Access Token - JWT error:", error.message);
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            console.log("401 Access Token Expired - JWT error:", error.message);
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        } else {
            console.log("500 Internal Server Error:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

module.exports = {
    verifyJWT,
}
