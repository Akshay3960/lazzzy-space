const express = require('express');
const router = express.Router();

const List = require('../../models/List');

router.post("/create_list", async (req, res) => {
    const cardList = req.body.cardList;

    try {
      //  console.log(req.body.listname);
        const new_list = await new List({
            listname: req.body.listname,
            cardList: cardList,
            
        });
        const result = await new_list.save();
        res.status(200).json(result);
    }
    catch(err) {
        console.log(err)
    }
});

router.get('/get_list',async(req,res)=>{
    try{
        const getList = await List.find();
        res.status(200).json(getList)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.put('/:id',async(req,res)=>{
    try{
        await List.findByIdAndUpdate(
            {_id:req.params.id},
            {$push: {cardList:req.body.cardList}}
        );
        res.status(200).json("List updated")
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Delete list
router.delete('/:id', async(req, res) => {
    try {
        await List.findByIdAndDelete(req.params.id);
        res.status(200).json("List deleted");
    }
    catch(e){
        res.status(500)("Deletion not successful", e);
    }
});
//Delete cardList element
router.delete('/:list/:card', async(req, res) => {
    try {
        await List.findByIdAndUpdate(
            {_id:req.params.list},
            {$pull:{cardList:{_id:req.params.card}}}
            );
            res.status(200).json("deletion successful")
    }
    catch(e){
        res.status(500).json("Deletion not successful");
    }
});


module.exports = router;