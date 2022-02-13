const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    lists: [
        {
            _id: false,
            list: {
                type: String,
            }
        },
    ],

    backgroundURL: {
        type: String,
    },

    members: [
        {
            _id: false,
            user: {
                type: String,
                ref: 'users',
            },
        },

    ],

});

module.exports = Board = mongoose.model('board', BoardSchema);
