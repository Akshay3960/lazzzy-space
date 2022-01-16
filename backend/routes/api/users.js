const express = require('express');
const router = express.Router();

const User = require('../../models/User');


// GET api/items
router.get('/',(req,res) => {
    User.find()
        .sort({ date: -1 })
        .then(users => res.json(users));
});

// POST api/items
router.post('/',(req,res) => {
    const newUser = new User({
        username: req.body.username,
        fullname:req.body.fullname,
        password: req.body.password,
        email:req.body.email,
    });

    newUser.save().then(user => res.json(user));
})

module.exports = router;