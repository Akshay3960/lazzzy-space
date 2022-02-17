const express = require("express");
const router = express.Router();

const List = require("../../models/List");
const Board = require("../../models/Board");

router.post("/create_list/:bid", async (req, res) => {
  const cardList = req.body.cardList;

  try {
    const new_list = await new List({
      listname: req.body.listname,
      cardList: cardList,
    });
    const result = await new_list.save();
    await Board.findByIdAndUpdate(
      { _id: req.params.bid },
      { $push: { lists: { list: result._id } } }
    );
    res.status(200).json({ id: result.id });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get_list/:bid", async (req, res) => {
  try {
    const getBoard = await Board.findById(req.params.bid);
    const col_list = [];
    for (const group of getBoard.lists) {
      let group_res = await List.findById(group.list);
      col_list.push(group_res);
    }
    res.status(200).json(col_list);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/get_card/:lid', async (req, res) => )

router.put("/:id", async (req, res) => {
  let Res;
  try {
    Res = await List.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { cardList: req.body.cardList } },
      { new: true }
    );
    const newCards = Res.cardList;
    res.status(200).json({ id: newCards[newCards.length - 1].id });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete list
router.delete("/delete_list/:lid/:bid", async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.lid);
    await Board.findByIdAndUpdate(
      { _id: req.params.bid },
      { $pull: { lists: { list: req.params.lid } } }
    );
    res.status(200).json("List deleted");
  } catch (e) {
    res.status(500).json("Deletion not successful", e);
  }
});
//Delete cardList element
router.delete("/delete_card/:list/:card", async (req, res) => {
  try {
    await List.findByIdAndUpdate(
      { _id: req.params.list },
      { $pull: { cardList: { _id: req.params.card } } }
    );
    res.status(200).json("deletion successful");
  } catch (e) {
    res.status(500).json("Deletion not successful");
  }
});

router.post("/:deleteList/:card/:addList/:pos", async (req, res) => {
  const delList = await List.findById(req.params.deleteList);
  const cardAdd = delList.cardList.filter((cards) => {
    return cards._id == req.params.card;
  });

  try {
    await List.findByIdAndUpdate(
      { _id: req.params.deleteList },
      { $pull: { cardList: { _id: req.params.card } } }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json("delete from previous list unsuccessful");
  }

  try {
    await List.findByIdAndUpdate(
      { _id: req.params.addList },
      { $push: { cardList: { $each: cardAdd, $position: req.params.pos } } }
    );
    res.status(200).json("addition successful");
  } catch (err) {
    console.log(err);
    res.status(500).json("add to new list unsuccessful");
  }
});

// code that didn't work
// router.post('/:deleteList/:addList', async (req, res) => {
//     const delList = await List.findById(req.params.deleteList)
//     const addList = await List.findById(req.params.addList)
//     const delListData = req.body.delListData
//     const addListData = req.body.addListData
//     console.log(delListData)
//     try {
//         await List.find(
//             { _id: delList },
//             { $set: { cardList: delListData.cardList } },
//             { upsert: true }
//         )
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json("couldn't replace delList")
//     }
//     try {
//         await List.findByIdAndUpdate(
//             { _id: addList },
//             { $set: { cardList: addListData.cardList } },
//             { upsert: true }
//         )
//     }
//     catch (err) {
//         console.log(err)
//         res.status(500).json("couldn't replace addList")
//     }
// })

module.exports = router;
