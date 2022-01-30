const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    lists:[
        {
            type: Schema.Types.ObjectId,
            ref:'lists',
        },
    ],
    
    backgroundURL:{
        type: String,
    },

    members:[
        {
            _id:false,
            user:{
                type:Schema.Types.ObjectId,
                ref:'users',
            },
        },

    ],

});

module.exports = Board = mongoose.model('board',BoardSchema);
