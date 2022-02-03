const { json } = require('body-parser');
const express = require('express');
const multer = require('multer');
//const path = require('path');
const Files = require('../../models/File')


const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'images')
    },
    filename: function (req, file, cb) {
    cb(null, new Date().toISOString()+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypesAllowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    //check whether filetype allowed is acceptable
    if(fileTypesAllowed.includes(file.mimetype)) {
        cb(null, true);

    }
    else{
        cb(null, false);
    }
}

const upload = multer({storage,  fileFilter, limits :{
    fileSize: 20 * 1024 *1024 // 20 MB
        }
    }
)
const arr = upload.array("files",10)
router.post('/upload', arr, async(req, res)=> {
    const file = req.file
    try{

    if(!file) {
        console.log("Upload file")
        return 

    }
    console.log(file.path)
    const file_name = await new Files({
        files: 
        [{
            file:{

            path: file.path
        }
        }]
    })

    const saveFile = await file_name.save()
    res.status(200).json(saveFile);
}
catch (e){
    console.log(e)
    res.status(500).json("Some error")
}

})

module.exports = router;