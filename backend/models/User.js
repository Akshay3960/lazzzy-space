const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: false,
        //unique: true,
    },
    fullname: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        //unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        file: {
            path: String,
        }
    },

    boards:[{
        type:Schema.Types.ObjectId,
        ref:'boards',
    }]


});

module.exports = User = mongoose.model('user', UserSchema);