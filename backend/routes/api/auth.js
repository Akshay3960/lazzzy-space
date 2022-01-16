const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt')


const router = express.Router();

/*User registration */

router.post("/signup", async (req, res) => {
    try {
        //check if user already exist
        const fetched_user = await User.findOne({
            username: req.body.username,
        })
        if (fetched_user) {
            console.log("user already exist")
            return res.status(500).json("User already exist")
        }
        const cryptsalt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(req.body.password, cryptsalt);
        const new_user = await new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedpass,
        });

        const result = await new_user.save();
        res.status(200).json(result);

    } catch (err) {
        console.log(err)
    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        !user && res.status(404).json("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password)
        !validPass && res.status(400).json("Wrong Password")

        res.status(200).json(user)

    } catch (err) {
        console.log(err)
    }
})

module.exports = router;