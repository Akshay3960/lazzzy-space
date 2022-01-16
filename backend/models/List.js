const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    listname: {
        type: String,
        required: true
    },
    card: [{
        cardname: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }]
})