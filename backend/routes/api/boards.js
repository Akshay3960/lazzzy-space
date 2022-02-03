const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Board = require("../../models/Board");

router.post("/create_board", async (req, res) => {
    try {
    //create and save the board
    const newBoard = new Board({
        title: req.body.title,
        backgroundURL: req.body.backgroundURL,
    });

    const board = await newBoard.save();

    //add board to user's boards
    const user = await User.findById(req.body.id);
    user.boards.unshift(board._id);
    await user.save();

    //add user to board members
    await Board.findByIdAndUpdate(
        { _id: board._id },
        { $set: { members: { user: user._id } } }
    );

    res.status(200).json(board);
    } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
    }
});

//get user's boards
router.get("/get_boards", async (req, res) => {
    try {
    const user = await User.findById(req.body.id);
    const boards = [];
    for (const boardId of user.boards) {
        boards.push(await Board.findById(boardId));
    }
    res.status(200).json(boards);
    } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
    }
});

//get board by id
router.get("/id", async (req, res) => {
    try {
    const board = await Board.findById(req.body.id);
    if (!board) {
        return res.status(404).json("Board is not found");
    }
    res.status(200).json(board);
    } catch (err) {
    console.error(err.message);
    res.status(500).json.send("server error");
    }
});

//change a board's title

router.put("/rename/id", async (req, res) => {
    try {
    const board = await Board.findById(req.body.id);
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

router.put("/addmember/:uid/:bid", async (req, res) => {
try {
    const board = await Board.findById(req.params.bid);
    const user = await User.findById(req.params.uid);
    //see if user already member
    if (board.members.user.findById(user._id)) {
        return res.status(400).json("already a member");
    }
    // add board to user's boards
    user.boards.unshift(board._id);
    await user.save();

    // add user to board members
    board.members.unshift(user._id);
    await board.save();

    res.status(200).json(board);

    } 
    catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
    }
});

module.exports = router;
