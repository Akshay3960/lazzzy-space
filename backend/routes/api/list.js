const express = require('express');
const router = express.Router();

const List = require('../../models/List');

router.post("/create_list", async (req, res) => {
    try {
        const new_list = await new List({
            listname: req.body.listname,
        });
        const result = await new_list.save();
        res.status(200).json(result);
    }
    catch {
        console.log(err)
    }
});

module.exports = router;