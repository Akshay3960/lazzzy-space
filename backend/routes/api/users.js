const express = require('express');
const router = express.Router();
const multer = require('multer');

const User = require('../../models/User');

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

//update user
router.put("/:id", profile.single("pic"), async (req, res) => {
    const updates = {
        "username": req.body.username,
        "image": {
            "file": ""
        }
    };
    if (req.file) {
        updates.image.file = req.file.path
    }
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.status(200).json("Profile Updated Succesfully");
    }
    catch (e) {
        return res.status(500).json(err);
    }
});

// get user profile
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// set isFavourite
router.put('/setfav/:uid/:bid', async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        const fav = !req.body.isFavourite;
        await User.updateOne(
            { _id: user._id, "boards.bid": req.params.bid },
            { $set: {"boards.$.isFavourite": fav} }
        )
        res.status(200).json("Fav set Successfull")
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

// GET user
router.get('/getuser', (req, res) => {
    User.find()
        .sort({ date: -1 })
        .then(users => res.json(users));
});

// POST api/items
router.post('/', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        fullname: req.body.fullname,
        password: req.body.password,
        email: req.body.email,
    });

    newUser.save().then(user => res.json(user));
})

module.exports = router;