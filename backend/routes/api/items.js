const express = require('express');
const router = express.Router();

const Item = require('../../models/Item');

// GET api/items
router.get('/', (req, res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items));
});

// POST api/items
router.post('/', (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save().then(item => res.json(item));
});

// GET api/items
router.get('/',(req,res) => {
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items));
});

// POST api/items
router.post('/',(req,res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save().then(item => res.json(item));
})

module.exports = router;

