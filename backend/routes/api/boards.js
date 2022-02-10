const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const Board = require('../../models/Board')

router.post('/create_board/:id',
    async (req, res) => {
        try {
            //create and save the board
            if(req.params.id=== undefined)
            {
                res.status(400).json("no user id")
            }
            const newBoard = new Board({
                title: req.body.title,
                backgroundURL: req.body.backgroundURL,
            });

            const board = await newBoard.save();

            //add board to user's boards
            const user = await User.findById(req.params.id);
            await User.findByIdAndUpdate(
                { _id: user._id },
                { $set: { boards: { bid: board._id } } }
            )

            //add user to board members
            await Board.findByIdAndUpdate(
                { _id: board._id },
                { $set: { members: { user: user._id } } }
            )

            res.status(200).json(board);

        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//get user's boards
router.get('/:uid', async (req, res) => {

    try {
        const user = await User.findById(req.params.uid);
        const boards = [];
        for (const board of user.boards) {
            let resBoard = await Board.findById(board.bid);
            
            boards.push({
                board: resBoard,
                isFavourite: board.isFavourite

            });
        }
        res.status(200).json(boards);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});

//get board by id
router.get("/:bid", async (req, res) => {
    try {
        const board = await Board.findById(req.params.bid);
        if (!board) {

            return res.status(404).json('Board is not found');
        }
        res.status(200).json(board);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json.send("server error");
    }
});

//change a board's title

router.put('/rename/:bid', async (req, res) => {

    try {
        const board = await Board.findById(req.params.bid);
        if (!board) {
            return res.status(404).json("board is not found");
        }

        board.title = req.body.title;
        await board.save();
        res.status(200).json(board);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// add member to the board
router.put('/:bid/:uid', async (req, res) => {
    try {
        const board = await Board.findById(req.params.bid);
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json("user not found");
        }
        //see if user already member
        const memberId = board.members.filter((member) => {
            return member == req.params.uid;
        })
        console.log(memberId);
        if (memberId.length != 0) {
            return res.status(400).json("already member");
        }
        // add board to user's boards
        await User.findByIdAndUpdate(
            { _id: user._id },
            { $push: { boards: { bid: board._id } } }
        )

        // add user to board members
        await Board.findByIdAndUpdate(
            { _id: board._id },
            { $push: { members: { user: user._id } } }
        )


        res.status(200).json(board);

    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
