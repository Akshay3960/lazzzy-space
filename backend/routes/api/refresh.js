const express = require('express');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();
// Use refresh token to send new access token

router.get('/', async (req, res) => {
    
    const cookies = req.cookies;
    // console.log(cookies.jwt)
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const current_user = await User.findOne({refreshToken});
    if(!current_user) return  res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || current_user.username!== decoded.username){
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                {"username": decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '10s'}
            );
            res.json({accessToken})
        }
    );
})

module.exports = router;