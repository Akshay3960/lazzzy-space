const express = require('express');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();
require('dotenv').config();

// Use refresh token to send new access token
router.get('/', async (req, res) => {
    
    const cookies = req.cookies;
    // console.log(cookies.jwt)
    if (!cookies?.jwt) return res.sendStatus(401); //unauthorized
    const refreshToken = cookies.jwt;
    // Delete after one use
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure:true });
    
    //Detected refresh token that is reused again!! 
    //handling token misuse
    const current_user = await User.findOne({refreshToken});
    if(!current_user){ 
        // console.log("don't have refresh", current_user)
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                
                if (err) return res.sendStatus(403); //Forbidden
                // Delete refresh tokens of hacked user
                const hackedUser = await User.findOne({ username: decoded.username }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        )
        return res.sendStatus(403); //Forbidden

    }

    const newRefreshTokenArray = current_user.refreshToken.filter(rt => rt !== refreshToken);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async(err, decoded) => {
            
            if (err) {
                //refresh token has expired handling.
                // console.log("Expired!!")
                current_user.refreshToken = [...newRefreshTokenArray];
                const result = await current_user.save();
            }
            // refresh token is wrong.
            // console.log(decoded.username)
            if (err || current_user.username !== decoded.username) {
                // console.log("I was here", newRefreshTokenArray)
                return res.sendStatus(403);
            }
            // Refresh token was still valid

            //set new accessToken
            const accessToken = jwt.sign(
                {"username": decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '5m'}
            );
            //renew with new refresh token
            const newRefreshToken = jwt.sign(
                { "username": current_user.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            current_user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await current_user.save();

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true,  sameSite: 'none',secure: true, maxAge: 24 * 60 * 60 * 1000 });

            res.json({accessToken})
        }
    );
})

module.exports = router;