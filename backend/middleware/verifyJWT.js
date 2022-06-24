const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    //If there is not token send from request then status 401 unauthorized
    if (!authHeader?.startsWith('Bearer ')) {
        // console.log("hell")
        return res.sendStatus(401)
    };
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.username = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT