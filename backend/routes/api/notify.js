const express = require('express');
const User = require('../../models/User');
const Board = require('../../models/Board');
const router = express.Router();
// send notification

router.post('/sent_notify/:uid/:bid/:ruid', async(req, res) => {

    try{
        const user = await User.findById(req.params.uid);
        const board = await Board.findById(req.params.bid);
        const recpt_user = await User.findById(req.params.ruid);

        const notify_msg = {
            notify_type: "invite",
            boardName: board.title,
            userName: user.username,
            sendTime: new Date().toLocaleString(),
            uid: req.params.uid,
            bid: req.params.bid
        }
        // update the recipient user notification box
        await User.findByIdAndUpdate(
            { _id: recpt_user._id },
            { $push: { notification: notify_msg } }
        )
        console.log(notify_msg);
        
        res.status(200).send("sent successful");

    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/handle_notify/:uid/:bid/:suid/:nid', async(req, res) => {

    try{
        const user = await User.findById(req.params.uid); //recpt user
        const board = await Board.findById(req.params.bid); //board
        const sent_user = await User.findById(req.params.suid); //send user

        //the decision whether accept:true or deny:false
        const decision = req.body.decision;
        if (decision == true ){
            //delete the accepted notify from recpt_user
            await User.findByIdAndUpdate(
                { _id: req.params.uid },
                { $pull: { notification: { _id: req.params.nid} } }
            );
            let notify_msg = {
                notify_type: "respond",
                uid: req.params.uid,
                userName: user.username,
                boardName: board.title,
                sendTime:  new Date().toLocaleString(),
                accept: "Yes"
            }
            //send in sent_user side with notification as response
            await User.findByIdAndUpdate(
                { _id: sent_user._id },
                { $push: { notification:  notify_msg } }
            )
            // add board to users board list
            await User.findByIdAndUpdate(
                { _id: user._id },
                { $push: { boards: { bid: board._id } } }
            )

            //add user to board members
            await Board.findByIdAndUpdate(
                { _id: board._id },
                { $push: { members: { user: user._id } } }
            )

            
        }

        else {
            let notify_msg = {
                notify_type: "respond",
                uid: req.params.uid,
                userName: user.username,
                boardName: board.title,
                sendTime:  new Date().toLocaleString(),
                accept: "No"
            }
            //delete the accepted notify from recpt_user
            await User.findByIdAndUpdate(
                { _id: req.params.uid },
                { $pull: { notification: { _id: req.params.nid} } }
            );
            //send in sent_user side with notification as response
            await User.findByIdAndUpdate(
                { _id: sent_user._id },
                { $push: { notification:  notify_msg } }
            )

        }
        
        
        res.status(200).send("sent successful");

    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

//get user notification
router.get('/:uid', async(req, res) => {

    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json('Board is not found');
        }
        res.status(200).json(user.notification)

        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
})
module.exports = router;