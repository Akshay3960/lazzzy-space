const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt')
const multer = require('multer');


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypesAllowed = ['image/jpeg', 'image/jpg', 'image/png'];

    //check whether filetype allowed is acceptable
    if (fileTypesAllowed.includes(file.mimetype)) {
        cb(null, true);

    }
    else {
        cb(null, false);
    }
}

const profile = multer({
    storage, fileFilter, limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    }
}
)

/*User registration */

router.post("/signup", profile.single("pic"), async (req, res) => {
    try {
        //check if user already exist
        const fetched_user = await User.find({
            $or:[{email: req.body.email},{username: req.body.username}]
        })
        if (fetched_user.length != 0) {
            console.log(fetched_user)
            return res.status(500).json("User already exist")
        }
        if (req.file) {
            const cryptsalt = await bcrypt.genSalt(10);
            const hashedpass = await bcrypt.hash(req.body.password, cryptsalt);
            const new_user = await new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedpass,
                color: req.body.color,
                image:
                {
                    file: {

                        path: req.file.path
                    }
                }
            });

            const result = await new_user.save();
            res.status(200).json(result);
        }
        else {
            const cryptsalt = await bcrypt.genSalt(10);
            const hashedpass = await bcrypt.hash(req.body.password, cryptsalt);
            const new_user = await new User({
                email: req.body.email,
                username: req.body.username,
                password: hashedpass,
                color: req.body.color,
            });

            const result = await new_user.save();
            res.status(200).json(result);
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(err);
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