const User = require("../models/user.model.js");
const generateAndAcessRefreshToken = async(userId)=>{
   try{
      const user = await User.findById(userId);
      console.log(user,"generate token");
      const accessToken =  await user.generateacessToken();
      const refreshToken = await user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({validateBeforeSave:false});
      
     console.log(refreshToken,"",accessToken)
      return {refreshToken,accessToken}
   }
   catch(error){
    console.log(error)
   }
};

const register = async (req, res, next) => {
    const { contact, email,password } = req.body;
    console.log("fullname:", contact, "email:", email, "pass:", password);
    try {
        // Check if the user already exists
        const existedUser = await User.findOne({
            $or: [{email}]
        })
        if (existedUser) {
            return res.status(409).json({ error: "Email already register please login" });
        }
        const user = await User.create({
            email,
            contact,
            password,
        });

        // Fetch the created user without password and refreshToken

       
        const { accessToken, refreshToken } = await generateAndAcessRefreshToken(user._id);
        console.log("Access token:", accessToken);

        console.log("User registered:", user);
        //    Set cookie options based on environment
        const isProduction = true;
        const options = {
            httpOnly: true,
            secure: isProduction, // secure in production only
            sameSite: isProduction ? 'None' : 'Lax', // Required for cross-origin cookies in production
            maxAge: 24 * 60 * 60 * 1000, // Set the cookie expiration (1 day)
            domain:'.wepreorder.vercel.app',
        };

        // Set cookies and send response
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json(user);

    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async(req, res) => {
    console.log(req.user)
    const user = req.user;
    
    return res
    .status(200)
    .json(user)
}

const loginUser = async (req, res, next) => {
    const {email,password } = req.body;
    console.log( "email:",email, "pass", password);

    try {
        const existedUser = await User.findOne({ email });
        if (!existedUser) {
            console.log("User not found:", email);
            return res.status(404).json({ message: "User not found please register" });
        }

        const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(404).json({ message: "Incorrect password" });
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAndAcessRefreshToken(existedUser._id);
        console.log("Access token:", accessToken);

        // Get user data without the password field
        const loggedInUser = await User.findById(existedUser._id).select("-password");
        console.log("Logged in user:", loggedInUser);
        
           // Set cookie options based on environment
       
        // res.status(200).json(loggedInUser);
         const isProduction = true;
        const options = {
            httpOnly: true,
            secure: isProduction, // secure in production only
            sameSite: isProduction ? 'None' : 'Lax', // Required for cross-origin cookies in production
            maxAge: 24 * 60 * 60 * 1000 // Set the cookie expiration (1 day)
        };

        // Set cookies and send response
        res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json(loggedInUser);

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = {
    register,loginUser,getCurrentUser
};