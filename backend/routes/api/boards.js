const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const Board = require('../../models/Board');
const { set } = require("mongoose");

router.post('/create_board/:id',
    async (req, res) => {
        try {
            //create and save the board
            if (req.params.id === undefined) {
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
                { $push: { boards: { bid: board._id } } }
            )

            //add user to board members
            await Board.findByIdAndUpdate(
                { _id: board._id },
                { $push: { members: { user: user._id } } }
            )
            // Send Invites to other users
            if (typeof req.body.ruserIds !== 'undefined') {

                const ruserIds = req.body.ruserIds;
                
                for(const ruserId of ruserIds){
                    let ruser = await User.findById(ruserId);
                    const notify_msg = {
                        notify_type: "invite",
                        boardName: board.title,
                        userName: user.username,
                        sendTime: new Date().toLocaleString(),
                        uid: user._id,
                        bid: board._id
                    }
                    // update the recipient user notification box
                    await User.findByIdAndUpdate(
                        { _id: ruser._id },
                        { $push: { notification: notify_msg } }
                    )
                    console.log(notify_msg);  
                }
                
            
            }

            // if (typeof req.body.userIds !== 'undefined') {
            //     jsonObj = req.body.userIds.map(JSON.stringify)
            //     uniqueUser = new Set(jsonObj)
            //     userIds = Array.from(uniqueUser).map(JSON.parse)
            //     // remove admin/creator userId
            //     const noAdmin = userIds.filter((admin) => {
            //         return admin.id != user.id
            //     })
            //     //OPTIONAL
            //     for (const userId of noAdmin) {
            //         const user = await User.findById(userId.id);
            //         if (!user) {
            //             continue
            //         }
            //         //OPTIONAL: see if user already member
            //         const memberId = board.members.filter((member) => {
            //             return member.user == user.id;
            //         })
            //         if (memberId.length != 0) {
            //             continue
            //         }
            //         // add board to user's boards
            //         await User.findByIdAndUpdate(
            //             { _id: user._id },
            //             { $push: { boards: { bid: board._id } } }
            //         )

            //         // add user to board members
            //         await Board.findByIdAndUpdate(
            //             { _id: board._id },
            //             { $push: { members: { user: user._id } } }
            //         )

            //     } 
            // }

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

// add members to the board
router.post('/add_users/:bid', async (req, res) => {
    try {
        const board = await Board.findById(req.params.bid);
        //https://www.geeksforgeeks.org/how-to-remove-duplicates-from-an-array-of-objects-using-javascript/
        jsonObj = req.body.userIds.map(JSON.stringify)
        uniqueUser = new Set(jsonObj)
        userIds = Array.from(uniqueUser).map(JSON.parse)
        console.log(userIds)
        for (const userId of userIds) {
            const user = await User.findById(userId.id);
            if (!user) {
                continue
            }
            //see if user already member
            const memberId = board.members.filter((member) => {
                return member.user == user.id;
            })
            if (memberId.length != 0) {
                continue
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

        }
        res.status(200).json(board)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
