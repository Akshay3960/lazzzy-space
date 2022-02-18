const { json } = require('body-parser');
const express = require('express');
const multer = require('multer');
// const Files = require('../../models/File')
const List = require('../../models/List')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypesAllowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    //check whether filetype allowed is acceptable
    if (fileTypesAllowed.includes(file.mimetype)) {
        cb(null, true);

    }
    else {
        cb(null, false);
    }
}

const upload = multer({
    storage, fileFilter, limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB
    }
}
)

const arr = upload.array("files", 10)
router.post('/file_upload/:cid', arr, async (req, res) => {
    let Res;
    try {
        filePaths = []
        for (const file of req.files) {
            if (!file) {
                console.log("Upload file")
                return
            }
            filePaths.push({
                file: {
                    path: file.path
                }
            })
        }
        Res = await List.findOneAndUpdate(
            { 'cardList._id': req.params.cid },
            { $push: { 'cardList.$.files': filePaths } },
        );
        res.status(200).json("success")
    }
    catch (err) {
        console.log(err)
        res.status(500).json("something went wrong")
    }
})


module.exports = router;