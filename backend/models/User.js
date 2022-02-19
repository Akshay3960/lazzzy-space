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
    color:{
        type: String,
        required: true,
    },
    image: {
        file: {
            path: String,
        }
    },

    boards: [
        {
            _id: false,
            bid: {
                type: String,
                ref: 'boards',
            },
            isFavourite: {
                type: Boolean,
                default: false,
            }
        },

    ],


});

module.exports = User = mongoose.model('user', UserSchema);