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


module.exports = router;